from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/step', methods=['GET'])
def get_flattened_data():
    data = np.random.rand(64, 256)
    response = {
        "dim": {
            "x": data.shape[0],
            "y": data.shape[1]
        },
        "data": data.flatten().tolist()
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
