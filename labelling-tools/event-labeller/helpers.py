from flask import request


def assert_required_args(required_args):
    if not all(arg in request.args for arg in required_args):
        raise Exception(
            f"Expected {', '.join(required_args)} in request body, got {', '.join(request.args.keys())}"
        )


def assert_required_json(required_json):
    if not all(arg in request.json for arg in required_json):
        raise Exception(
            f"Expected {', '.join(required_json)} in request body, got {', '.join(request.json.keys())}"
        ) 

