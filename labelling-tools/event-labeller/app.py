from flask import Flask, render_template, request, jsonify

from helpers import assert_required_args, assert_required_json

import csv
import os
from pathlib import Path

app = Flask(__name__)

with open("./event_vocab.txt", "r") as reader:
    event_vocab = [line.strip() for line in reader.readlines()]

output_dir = Path("./output/")
output_dir.mkdir(exist_ok=True)


def main():
    app.run()


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", event_vocab=event_vocab)


@app.route("/log_event", methods=["POST"])
def log_event():
    required_json = ["video_name", "event_type", "start_ts", "end_ts"]
    assert_required_json(required_json)

    video_name = request.json["video_name"]

    if not video_name:
        raise ValueError("Parameter video_name empty")

    event_type_index = request.json["event_type"]

    start_ts = float(request.json["start_ts"])
    end_ts = float(request.json["end_ts"])

    if end_ts - start_ts < 0:
        raise ValueError("Timestamps must be valid")

    output_file = Path(output_dir / f"{video_name}.output")
    output_file.touch()
    if not output_file.read_text():
        output_file.write_text("video_name,event_type,start_ts,end_ts\n")
    with output_file.open("a") as writer:
        to_write = (
            ",".join(map(str, (video_name, event_type_index, start_ts, end_ts))) + "\n"
        )
        writer.write(to_write)

    return jsonify()


@app.route("/get_events", methods=["GET"])
def get_events():
    required_args = ["video_name"]
    assert_required_args(required_args)

    video_name = request.args["video_name"]

    if not video_name:
        raise ValueError("Parameter video_name empty")

    file_to_read = output_dir / f"{video_name}.output"

    if not file_to_read.exists():
        return jsonify()

    with (output_dir / f"{video_name}.output").open("r") as reader:
        events = list(csv.DictReader(reader))

    return jsonify(events)


@app.route("/get_event_vocab", methods=["GET"])
def get_event_vocab():
    return jsonify(event_vocab)


if __name__ == "__main__":
    main()
