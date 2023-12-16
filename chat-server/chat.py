from flask import Flask, request, jsonify
from collections import defaultdict
from flask_cors import CORS
from random import randint

app = Flask(__name__)
CORS(app)

# This will store the chats. Each chat is identified by an ID and contains a list of messages.
chats = defaultdict(list)


@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    chat_id = data['chat_id']
    message = {'sender': data['name'], 'message': data['message'], 'id': randint(0, 0xffff)}
    chats[chat_id].append(message)
    return jsonify({"status": "success", "chat_id": chat_id, "message": message})


@app.route('/get_messages', methods=['POST'])
def get_messages():
    chat_id = request.json['chat_id']
    if chat_id in chats:
        return jsonify(chats[chat_id])
    else:
        return jsonify([])


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
