(() => {
	const video_node = document.getElementById('video-node');
	const video_name_input = document.getElementById('video-name-input');
	const event_trigger = document.getElementById('event-trigger');

	let event_vocab;

	(async () => {
		event_vocab = await request('/get_event_vocab', {}, 'GET');
	})().catch(error => console.error(error));

	let recording_event = false;
	let awaiting_event_type = false;
	let start_ts = -1;
	let end_ts = -1;
	event_trigger.addEventListener('click', async () => {
		if (!recording_event) {
			start_ts = video_node.currentTime;
			recording_event = true;

			event_trigger.innerText = 'End event';
		} else if (!awaiting_event_type) {
			end_ts = video_node.currentTime;
			awaiting_event_type = true;

			event_trigger.innerText = 'Give event type verdict'
		} else {
			await video_node.pause();

			recording_event = false;
			awaiting_event_type = false;

			if (end_ts > start_ts) {
				const event_type = prompt_event_type(event_vocab);
				if (!isNaN(event_type)) {
					log_event_to_backend(video_name_input.value, start_ts, end_ts, event_type);
					append_event_to_events_table(start_ts, end_ts, event_type);
				}
			}

			await video_node.play();

			event_trigger.innerText = 'Trigger event';
		}
	});

	if (video_name_input.value) {
		get_events(video_name_input.value).then(events => {
			for (const event of Array.from(events)) {
				append_event_to_events_table(event.start_ts, event.end_ts, event.event_type);
			}
		});
	}

	const events_table_body = document.getElementById('events-table-body');
	video_name_input.addEventListener('input', () => {
		events_table_body.innerHTML = '';
		get_events(video_name_input.value).then(events => {
			for (const event of Array.from(events)) {
				append_event_to_events_table(event.start_ts, event.end_ts, event.event_type);
			}
		});
	});
})();

function prompt_event_type(event_vocab) {
	const prompt_message = `
Type event type number:
${event_vocab.map((event_type, i) => `${i} -> ${event_type}`).join('\n')}
`
	const event_type_index = parseInt(prompt(prompt_message));

	if (event_type_index >= event_vocab.length || event_type_index < 0) {
		// prompt again
		return prompt_event_type(event_vocab);
	}

	return event_type_index;
}

async function log_event_to_backend(video_name, start_ts, end_ts, event_type) {
	const payload = {
		video_name: video_name,
		start_ts: start_ts,
		end_ts: end_ts,
		event_type: event_type
	}

	return request('/log_event', payload, 'POST')
}

async function get_events(video_name) {
	const payload = {
		video_name: video_name
	}
	return await request('/get_events', payload, 'GET');
}

function append_event_to_events_table(start_ts, end_ts, event_type) {
	const video_node = document.getElementById('video-node');
	const events_table = document.getElementById('events-table');

	const new_event_row = events_table.insertRow();

	const event_type_cell = new_event_row.insertCell();
	event_type_cell.innerText = event_type;

	const start_ts_cell = new_event_row.insertCell();
	const start_ts_cell_link = document.createElement('a');
	start_ts_cell_link.innerText = start_ts;
	start_ts_cell_link.href = '#';
	start_ts_cell_link.addEventListener('click', () => {
		video_node.currentTime = start_ts;
	})
	start_ts_cell.appendChild(start_ts_cell_link);

	const end_ts_cell = new_event_row.insertCell();
	const end_ts_cell_link = document.createElement('a');
	end_ts_cell_link.innerText = end_ts;
	end_ts_cell_link.href = '#';
	end_ts_cell_link.addEventListener('click', () => {
		video_node.currentTime = end_ts;
	})
	end_ts_cell.appendChild(end_ts_cell_link);
}

async function request(url, json_parameters, method) {
	let init = {
		url: url,
		method: method,
		mode: 'cors',
		cors: 'default',
		cache: 'default'
	};

	switch (method) {
		case 'POST':
			init.headers = new Headers({
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			})
			init.body = JSON.stringify(json_parameters)
			break;

		case 'GET':
			init.headers = new Headers({
				'Accept': 'application/json'
			})
			url += '?' + new URLSearchParams(json_parameters).toString();
			break;

		default:
			return null;
	}

	const request = new Request(url, init);
	return await fetch(request).then(r => r.json());
}
