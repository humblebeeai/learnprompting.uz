import React from 'react';
import Layout from '@theme/Layout';

export default function Legal() {
	return (
		<Layout title="Litsenziya va Huquqlar" description="Learn Prompting O'zbekcha litsenziyasi">
			<div className="container margin-vert--xl">
				<div className="row">
					<div className="col col--8 col--offset-2">
						<h1>Litsenziya va Huquqlar</h1>

						<p>
							Ushbu veb-sayt (learnprompting.uz) <strong>Learn Prompting</strong> ochiq manbali kursining O'zbek tilidagi mustaqil tarjimasidir.
						</p>

						<div className="admonition admonition-info alert alert--info">
							<div className="admonition-heading">
								<h5>Litsenziya</h5>
							</div>
							<div className="admonition-content">
								<p>
									Barcha kontent <strong><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)</a></strong> litsenziyasi asosida tarqatiladi.
								</p>
							</div>
						</div>

						<h2>Bu nima degani?</h2>
						<ul>
							<li><strong>Ulashish:</strong> Siz materiallardan nusxa olishingiz va tarqatishingiz mumkin.</li>
							<li><strong>Moslashtirish:</strong> Siz materiallarni o'zgartirishingiz va ular asosida yangi narsalar yaratishingiz mumkin.</li>
						</ul>

						<h2>Shartlar:</h2>
						<ul>
							<li><strong>Mualliflik huquqi (Attribution):</strong> Siz asl manbaga (Learn Prompting) va tarjimonlarga (HumblebeeAI) havolalar berishingiz shart.</li>
							<li><strong>Notijoriy (Non-Commercial):</strong> Siz ushbu materiallardan tijoriy maqsadlarda (sotish uchun) foydalana olmaysiz.</li>
							<li><strong>Bir xil litsenziya (ShareAlike):</strong> Agar siz materiallarni o'zgartirsangiz, yangi materialni ham xuddi shu litsenziya ostida tarqatishingiz kerak.</li>
						</ul>

						<hr />

						<h2>Attribution (Manbalar)</h2>
						<p>
							<strong>Asl loyiha:</strong><br />
							<a href="https://learnprompting.org" target="_blank">Learn Prompting</a>
						</p>
						<p>
							<strong>O'zbekcha tarjima va texnik xizmat:</strong><br />
							<a href="https://humblebee.ai" target="_blank">HumblebeeAI</a> jamoasi
						</p>

						<hr />

						<h2>Disclaimer (Rad etish)</h2>
						<p>
							Ushbu loyiha Learn Prompting bilan rasmiy hamkorlik aloqalariga ega emas (independent community localization). Maqsadimiz - bilimni ochiq va bepul tarqatish.
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
