import requests
import re
import time
import os
import json
import hashlib
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

TILMOCH_API_URL = "https://websocket.tahrirchi.uz/translate-v2"
TILMOCH_API_KEY = os.getenv("TILMOCH_API_KEY")
SOURCE_LANG = "eng_Latn"
TARGET_LANG = "uzn_Latn"
MODEL = "tilmoch"

DOCS_DIR = Path("docs")
OUTPUT_DIR = Path("docs_uz")
CACHE_FILE = Path("data/translation_cache.json")
MIN_BATCH_SIZE = 800  # Minimum characters before sending translation request
BATCH_SEPARATOR = " §§§ "  # Separator for batching multiple texts

def load_cache():
    """Load translation cache from file."""
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[WARNING] Could not load cache: {e}")
            return {}
    return {}

def save_cache(cache):
    """Save translation cache to file."""
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[ERROR] Could not save cache: {e}")

def get_text_hash(text):
    """Generate a hash for text to use as cache key."""
    return hashlib.md5(text.encode('utf-8')).hexdigest()

# Translation cache
translation_cache = load_cache()

def translate_with_tilmoch(text: str) -> str:
    """Translate text using Tilmoch/Sayqalchi API with caching."""
    if not text or not text.strip():
        return text
    
    # Check cache first
    text_hash = get_text_hash(text)
    if text_hash in translation_cache:
        return translation_cache[text_hash]
    
    try:
        print(f"[API CALL] Translating {len(text)} chars: {text[:50]}...")
        response = requests.post(
            TILMOCH_API_URL,
            json={
                "text": text,
                "source_lang": SOURCE_LANG,
                "target_lang": TARGET_LANG,
                "model": MODEL,
            },
            headers={
                "Authorization": TILMOCH_API_KEY,
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        
        if response.status_code != 200:
            print(f"[ERROR] API returned status {response.status_code}")
            return text
        
        result = response.json()
        translated = result.get("translated_text", text)
        
        # Cache the translation
        translation_cache[text_hash] = translated
        
        time.sleep(0.2)  # Rate limiting
        return translated
    except Exception as e:
        print(f"[ERROR] Translation failed: {str(e)}")
        return text


def translate_batch(texts: list) -> list:
    """Translate multiple texts in a single API call."""
    if not texts:
        return []
    
    # Filter out empty texts and check cache
    texts_to_translate = []
    results = [None] * len(texts)
    
    for i, text in enumerate(texts):
        if not text or not text.strip():
            results[i] = text
            continue
        
        text_hash = get_text_hash(text)
        if text_hash in translation_cache:
            results[i] = translation_cache[text_hash]
        else:
            texts_to_translate.append((i, text))
    
    if not texts_to_translate:
        return results
    
    # Batch texts together with separator
    indices = [idx for idx, _ in texts_to_translate]
    batch_texts = [text for _, text in texts_to_translate]
    combined_text = BATCH_SEPARATOR.join(batch_texts)
    
    # Translate the batch
    try:
        print(f"[BATCH API] Translating {len(batch_texts)} texts ({len(combined_text)} chars)")
        response = requests.post(
            TILMOCH_API_URL,
            json={
                "text": combined_text,
                "source_lang": SOURCE_LANG,
                "target_lang": TARGET_LANG,
                "model": MODEL,
            },
            headers={
                "Authorization": TILMOCH_API_KEY,
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        
        if response.status_code != 200:
            print(f"[ERROR] Batch API returned status {response.status_code}")
            # Fallback to original texts
            for idx, text in texts_to_translate:
                results[idx] = text
            return results
        
        result = response.json()
        translated_combined = result.get("translated_text", combined_text)
        
        # Split back into individual translations
        translated_parts = translated_combined.split(BATCH_SEPARATOR)
        
        # Handle case where split doesn't match (API changed the separator)
        if len(translated_parts) != len(batch_texts):
            print(f"[WARNING] Batch split mismatch, using original texts")
            for idx, text in texts_to_translate:
                results[idx] = text
        else:
            # Cache and assign results
            for (idx, original_text), translated_text in zip(texts_to_translate, translated_parts):
                text_hash = get_text_hash(original_text)
                translation_cache[text_hash] = translated_text
                results[idx] = translated_text
        
        time.sleep(0.3)  # Rate limiting
        
    except Exception as e:
        print(f"[ERROR] Batch translation failed: {str(e)}")
        # Fallback to original texts
        for idx, text in texts_to_translate:
            results[idx] = text
    
    return results


def translate_mdx(mdx_content: str) -> str:
    """Translate MDX content with batched API calls for efficiency."""
    
    # Use placeholder system: extract text, batch translate, replace back
    PLACEHOLDER_PREFIX = "<<<TRANSLATE_"
    placeholders = []
    placeholder_count = 0
    
    def create_placeholder(text):
        """Create a placeholder for text that needs translation."""
        nonlocal placeholder_count
        if not text or not text.strip():
            return text
        placeholders.append(text)
        ph = f"{PLACEHOLDER_PREFIX}{placeholder_count}>>>"
        placeholder_count += 1
        return ph
    
    lines = mdx_content.split("\n")
    processed_lines = []
    in_code = False
    in_frontmatter = False
    in_export = False
    in_jsx_block = False
    brace_count = 0
    jsx_depth = 0

    # Regex patterns
    inline_code_regex = re.compile(r"(``.*?``|`.*?`)")
    link_regex = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
    jsx_tag_regex = re.compile(r"</?[A-Z][a-zA-Z0-9]*")
    html_tag_regex = re.compile(r"</?[a-z][a-zA-Z0-9]*")

    # === PASS 1: Replace translatable text with placeholders ===
    for i, orig_line in enumerate(lines):
        stripped = orig_line.strip()

        # === YAML Frontmatter ===
        if i == 0 and stripped == "---":
            in_frontmatter = True
            processed_lines.append(orig_line)
            continue
        
        if in_frontmatter:
            if stripped == "---":
                in_frontmatter = False
            elif "title:" in orig_line:
                match = re.search(r'title:\s*"([^"]*)"', orig_line)
                if match:
                    title = match.group(1)
                    title_clean = re.sub(r'[🟡🟢🔴🟣🟠🔵🟤⚪⚫🛸]', '', title).strip()
                    if title_clean:
                        ph = create_placeholder(title_clean)
                        orig_line = orig_line.replace(f'"{title}"', f'"{ph}"')
            processed_lines.append(orig_line)
            continue

        # === Code blocks ===
        if stripped.startswith("```"):
            in_code = not in_code
            processed_lines.append(orig_line)
            continue
        if in_code:
            processed_lines.append(orig_line)
            continue

        # === Export blocks ===
        if not in_export and stripped.startswith("export"):
            in_export = True
            brace_count = 0

        if in_export:
            brace_count += orig_line.count("{") - orig_line.count("}")
            if "title:" in orig_line:
                match = re.search(r'title:\s*"([^"]*)"', orig_line)
                if match:
                    title = match.group(1)
                    ph = create_placeholder(title)
                    orig_line = orig_line.replace(f'"{title}"', f'"{ph}"')
            processed_lines.append(orig_line)
            if brace_count == 0:
                in_export = False
            continue

        # === JSX/HTML blocks ===
        if not in_jsx_block and (jsx_tag_regex.match(stripped) or html_tag_regex.match(stripped)):
            jsx_depth = stripped.count("<") - stripped.count("</")
            if jsx_depth > 0 or not (">" in stripped and stripped.endswith(">")):
                in_jsx_block = True
            processed_lines.append(orig_line)
            continue
        
        if in_jsx_block:
            jsx_depth += stripped.count("<") - stripped.count("</")
            processed_lines.append(orig_line)
            if jsx_depth <= 0:
                in_jsx_block = False
            continue

        # === Empty lines ===
        if not stripped:
            processed_lines.append(orig_line)
            continue

        # === Single-line JSX/HTML ===
        if (jsx_tag_regex.match(stripped) or html_tag_regex.match(stripped)) and stripped.endswith(">"):
            processed_lines.append(orig_line)
            continue

        # === Headers ===
        if stripped.startswith("#"):
            match = re.match(r"^(#{1,6})\s+(.+)$", stripped)
            if match:
                hashes = match.group(1)
                text = match.group(2)
                text_clean = re.sub(r'[🟡🟢🔴🟣🟠🔵🟤⚪⚫🛸]', '', text).strip()
                if text_clean:
                    ph = create_placeholder(text_clean)
                    processed_lines.append(orig_line.replace(stripped, f"{hashes} {ph}"))
                else:
                    processed_lines.append(orig_line)
                continue

        # === List items ===
        if stripped.startswith(("- ", "* ")):
            bullet = "- " if stripped.startswith("- ") else "* "
            content = stripped[len(bullet):]
            
            # Handle inline code and links
            parts = inline_code_regex.split(content)
            new_parts = []
            for part in parts:
                if inline_code_regex.fullmatch(part):
                    new_parts.append(part)
                elif part.strip():
                    # Handle links
                    def link_replacer(m):
                        link_text = m.group(1)
                        url = m.group(2)
                        if link_text.startswith(("http://", "https://", "`")):
                            return m.group(0)
                        ph = create_placeholder(link_text)
                        return f"[{ph}]({url})"
                    
                    part = link_regex.sub(link_replacer, part)
                    if not part.startswith(("http://", "https://")):
                        ph = create_placeholder(part)
                        new_parts.append(ph)
                    else:
                        new_parts.append(part)
                else:
                    new_parts.append(part)
            
            new_content = "".join(new_parts)
            leading_space = orig_line[:-len(stripped)]
            processed_lines.append(f"{leading_space}{bullet}{new_content}")
            continue

        # === Regular paragraphs ===
        def link_replacer(m):
            link_text = m.group(1)
            url = m.group(2)
            if link_text.startswith(("http://", "https://", "`")):
                return m.group(0)
            ph = create_placeholder(link_text)
            return f"[{ph}]({url})"
        
        line_content = link_regex.sub(link_replacer, stripped)
        parts = inline_code_regex.split(line_content)
        new_parts = []
        for part in parts:
            if inline_code_regex.fullmatch(part):
                new_parts.append(part)
            elif part.strip() and not part.startswith(("http://", "https://", "@")):
                ph = create_placeholder(part)
                new_parts.append(ph)
            else:
                new_parts.append(part)
        
        new_line = "".join(new_parts)
        leading_space = orig_line[:-len(stripped)] if stripped else orig_line
        processed_lines.append(f"{leading_space}{new_line}")

    # === PASS 2: Batch translate all placeholders ===
    print(f"[BATCH] Collected {len(placeholders)} text segments for translation")
    
    if placeholders:
        # Batch translate in chunks of MIN_BATCH_SIZE
        translated_texts = []
        for i in range(0, len(placeholders), 50):  # Process 50 at a time max
            batch = placeholders[i:i+50]
            translated_batch = translate_batch(batch)
            translated_texts.extend(translated_batch)
        
        # Save cache after batch translation
        save_cache(translation_cache)
    else:
        translated_texts = []

    # === PASS 3: Replace placeholders with translations ===
    result = "\n".join(processed_lines)
    for i, translated_text in enumerate(translated_texts):
        placeholder = f"{PLACEHOLDER_PREFIX}{i}>>>"
        result = result.replace(placeholder, translated_text)
    
    return result


def translate_mdx_old(mdx_content: str) -> str:
    """OLD VERSION - Translate MDX content while preserving code blocks, inline code, JSX, and frontmatter."""
    lines = mdx_content.split("\n")
    result = []
    in_code = False
    in_frontmatter = False
    in_export = False
    in_jsx_block = False
    brace_count = 0
    jsx_depth = 0

    # Regex patterns
    inline_code_regex = re.compile(r"(``.*?``|`.*?`)")
    link_regex = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
    jsx_tag_regex = re.compile(r"</?[A-Z][a-zA-Z0-9]*")  # JSX component tags
    html_tag_regex = re.compile(r"</?[a-z][a-zA-Z0-9]*")  # HTML tags
    
    def link_replacer(m):
        link_text = m.group(1)
        url = m.group(2)
        # Don't translate if link text is just a URL or code
        if link_text.startswith(("http://", "https://", "`")):
            return m.group(0)
        return f"[{translate_with_tilmoch(link_text)}]({url})"

    for i, orig_line in enumerate(lines):
        stripped = orig_line.strip()

        # === YAML Frontmatter (---...---) ===
        if i == 0 and stripped == "---":
            in_frontmatter = True
            result.append(orig_line)
            continue
        
        if in_frontmatter:
            if stripped == "---":
                in_frontmatter = False
            # Only translate the title value in frontmatter
            elif "title:" in orig_line:
                match = re.search(r'title:\s*"([^"]*)"', orig_line)
                if match:
                    title = match.group(1)
                    # Remove emoji and translate
                    title_clean = re.sub(r'[🟡🟢🔴🟣🟠🔵🟤⚪⚫🛸]', '', title).strip()
                    if title_clean:
                        translated = translate_with_tilmoch(title_clean)
                        orig_line = orig_line.replace(f'"{title}"', f'"{translated}"')
            result.append(orig_line)
            continue

        # === Fenced code blocks ===
        if stripped.startswith("```"):
            in_code = not in_code
            result.append(orig_line)
            continue
        if in_code:
            result.append(orig_line)
            continue

        # === Export blocks ===
        if not in_export and stripped.startswith("export"):
            in_export = True
            brace_count = 0

        if in_export:
            brace_count += orig_line.count("{") - orig_line.count("}")
            if "title:" in orig_line:
                match = re.search(r'title:\s*"([^"]*)"', orig_line)
                if match:
                    title = match.group(1)
                    translated = translate_with_tilmoch(title)
                    orig_line = orig_line.replace(f'"{title}"', f'"{translated}"')
            result.append(orig_line)
            if brace_count == 0:
                in_export = False
            continue

        # === JSX/HTML block detection ===
        if not in_jsx_block and (jsx_tag_regex.match(stripped) or html_tag_regex.match(stripped)):
            jsx_depth = stripped.count("<") - stripped.count("</")
            if jsx_depth > 0 or not (">" in stripped and stripped.endswith(">")):
                in_jsx_block = True
            result.append(orig_line)
            continue
        
        if in_jsx_block:
            jsx_depth += stripped.count("<") - stripped.count("</")
            result.append(orig_line)
            if jsx_depth <= 0:
                in_jsx_block = False
            continue

        # === Empty lines ===
        if not stripped:
            result.append(orig_line)
            continue

        # === Single-line JSX/HTML tags ===
        if (jsx_tag_regex.match(stripped) or html_tag_regex.match(stripped)) and stripped.endswith(">"):
            result.append(orig_line)
            continue

        # === Headers ===
        if stripped.startswith("#"):
            match = re.match(r"^(#{1,6})\s+(.+)$", stripped)
            if match:
                hashes = match.group(1)
                text = match.group(2)
                # Remove emoji before translating
                text_clean = re.sub(r'[🟡🟢🔴🟣🟠🔵🟤⚪⚫🛸]', '', text).strip()
                if text_clean:
                    translated = translate_with_tilmoch(text_clean)
                    result.append(orig_line.replace(stripped, f"{hashes} {translated}"))
                else:
                    result.append(orig_line)
                continue

        # === List items ===
        if stripped.startswith(("- ", "* ")):
            bullet = "- " if stripped.startswith("- ") else "* "
            content_stripped = stripped[len(bullet):]

            # Translate link texts
            content_stripped = link_regex.sub(link_replacer, content_stripped)

            # Split by inline code
            parts = inline_code_regex.split(content_stripped)
            translated_parts = []
            for part in parts:
                if inline_code_regex.fullmatch(part):
                    translated_parts.append(part)
                elif part.strip() and not part.startswith(("http://", "https://")):
                    translated_parts.append(translate_with_tilmoch(part))
                else:
                    translated_parts.append(part)

            new_content = "".join(translated_parts)
            leading_space = orig_line[:-len(stripped)]
            result.append(f"{leading_space}{bullet}{new_content}")
            continue

        # === Regular paragraph lines ===
        line_content = stripped
        
        # Translate link texts
        line_content = link_regex.sub(link_replacer, line_content)

        # Split by inline code
        parts = inline_code_regex.split(line_content)
        translated_parts = []
        for part in parts:
            if inline_code_regex.fullmatch(part):
                translated_parts.append(part)
            elif part.strip() and not part.startswith(("http://", "https://", "@")):
                translated_parts.append(translate_with_tilmoch(part))
            else:
                translated_parts.append(part)

        new_line = "".join(translated_parts)
        leading_space = orig_line[:-len(stripped)] if stripped else orig_line
        result.append(f"{leading_space}{new_line}")

    return "\n".join(result)


def translate_file(input_path: Path, output_path: Path):
    """Translate a single MDX file."""
    try:
        print(f"\n{'='*80}")
        print(f"Processing: {input_path}")
        print(f"{'='*80}")
        
        # Read the file
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Translate
        translated_content = translate_mdx(content)
        
        # Create output directory if it doesn't exist
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write the translated file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(translated_content)
        
        print(f"[SUCCESS] Translated: {input_path} -> {output_path}")
        
    except Exception as e:
        print(f"[ERROR] Failed to translate {input_path}: {str(e)}")


def translate_all_mdx_files(force_retranslate=False):
    """Translate all MDX files from docs directory.
    
    Args:
        force_retranslate: If True, retranslate existing files. Default False.
    """
    if not TILMOCH_API_KEY:
        print("[ERROR] TILMOCH_API_KEY not found in environment variables!")
        print("Please set it in your .env file")
        return
    
    print(f"Starting translation of all MDX files...")
    print(f"Source: {DOCS_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Cache: {CACHE_FILE}")
    print(f"Force retranslate: {force_retranslate}")
    
    # Find all MDX files
    mdx_files = list(DOCS_DIR.rglob("*.mdx"))
    print(f"\nFound {len(mdx_files)} MDX files to translate")
    
    # Count how many need translation
    files_to_translate = []
    for mdx_file in mdx_files:
        rel_path = mdx_file.relative_to(DOCS_DIR)
        output_path = OUTPUT_DIR / rel_path
        if force_retranslate or not output_path.exists():
            files_to_translate.append((mdx_file, output_path))
    
    if not files_to_translate:
        print("\n[INFO] All files are already translated!")
        print("Use --force to retranslate existing files")
        return
    
    print(f"\nFiles to translate: {len(files_to_translate)}")
    print(f"Files to skip: {len(mdx_files) - len(files_to_translate)}")
    
    # Translate each file
    start_time = time.time()
    completed = 0
    failed = 0
    
    for i, (mdx_file, output_path) in enumerate(files_to_translate, 1):
        print(f"\n[{i}/{len(files_to_translate)}] ({completed} completed, {failed} failed)")
        
        try:
            translate_file(mdx_file, output_path)
            completed += 1
        except Exception as e:
            print(f"[ERROR] Failed: {e}")
            failed += 1
    
    # Summary
    elapsed = time.time() - start_time
    print(f"\n{'='*80}")
    print(f"TRANSLATION SUMMARY")
    print(f"{'='*80}")
    print(f"Total files:          {len(files_to_translate)}")
    print(f"Successfully completed: {completed}")
    print(f"Failed:                 {failed}")
    print(f"Time elapsed:           {elapsed:.1f} seconds ({elapsed/60:.1f} minutes)")
    if completed > 0:
        print(f"Average per file:       {elapsed/completed:.1f} seconds")
    print(f"Cache entries:          {len(translation_cache)}")
    print(f"Output directory:       {OUTPUT_DIR}")
    print(f"Cache file:             {CACHE_FILE}")
    print(f"{'='*80}")


if __name__ == "__main__":
    import sys
    
    # Check for --force flag
    force_retranslate = "--force" in sys.argv or "-f" in sys.argv
    
    translate_all_mdx_files(force_retranslate=force_retranslate)

