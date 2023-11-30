from flask import Flask, request, session, jsonify, send_from_directory
import os
import rc_lib
import json

app = Flask(__name__, static_folder="react-app/build")
app.secret_key = 'sh_u_e'


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/encrypt', methods=['POST'])
def encrypt_message():
    print(session)
    message = request.json['message']

    key = session.get('encryption_key')

    if key is None:
        key = rc_lib.key_gen()
        session['encryption_key'] = key

    encrypted_message = rc_lib.encrypt(message, key)
    return jsonify({'encrypted_message': encrypted_message})


@app.route('/decrypt', methods=['POST'])
def decrypt_message():
    print(session)
    message = request.json['message']
    key = session.get('encryption_key')

    if key is None:
        return jsonify({'error': 'Ключ шифрования отсутствует'})

    decrypted_message = rc_lib.decrypt(message, key)
    return json.dumps({'decrypted_message': decrypted_message}, ensure_ascii=False)


@app.route('/get_key', methods=['GET'])
def get_encryption_key():
    key = session.get('encryption_key', '')
    return jsonify({'encryption_key': key})


@app.route('/change_key', methods=['POST'])
def change_encryption_key():
    new_key = request.json.get('new_key')

    # Проверка нового ключа с использованием тестового сообщения
    test_message = "This is a test message."  # Тестовое сообщение
    try:
        encrypted_message = rc_lib.encrypt(test_message, new_key)
        decrypted_message = rc_lib.decrypt(encrypted_message, new_key)
        if decrypted_message != test_message:
            return jsonify({'error': 'Неверный ключ'}), 400
    except Exception as e:
        return jsonify({'error': 'Неверный ключ'}), 400

    # Если проверка прошла успешно, сохраняем новый ключ в сессии
    session['encryption_key'] = new_key
    return jsonify({'message': 'Ключ успешно изменен/добавлен'})


if __name__ == '__main__':
    app.run()
