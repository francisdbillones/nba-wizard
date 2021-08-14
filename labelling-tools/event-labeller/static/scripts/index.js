const URL = window.URL || window.webkitURL;

const video_file_input = document.getElementById('video-file-input');
const video_node = document.getElementById('video-node');

video_file_input.addEventListener('change', () => {
	const file = video_file_input.files[0];

	video_node.src = URL.createObjectURL(file);
});

if (video_file_input.files[0]) {
	video_node.src = URL.createObjectURL(video_file_input.files[0]);
}