from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Flask Backend!"})

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"data": "Example Data"})

@app.route('/api/post', methods=['POST'])
def post_data():
    content = request.json
    return jsonify({"received": content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
