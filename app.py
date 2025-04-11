
from flask import Flask, render_template, request, redirect, url_for, session
import json

app = Flask(__name__)
app.secret_key = 'secretkey'

with open('artifacts.json', 'r') as f:
    data = json.load(f)

@app.route('/')
def index():
    session['level'] = 0
    session['score'] = 0
    return render_template('index.html')

@app.route('/level/<int:level>', methods=['GET', 'POST'])
def level(level):
    if level > session.get('level', 0):
        return redirect(url_for('level', level=session.get('level', 0)))

    questions = data['levels'][level]['questions']
    if request.method == 'POST':
        answers = request.form.to_dict()
        correct = 0
        for q in questions:
            if answers.get(q['id'], '').strip().lower() == q['answer'].strip().lower():
                correct += 1
        session['score'] += correct
        session['level'] = level + 1
        return redirect(url_for('level', level=level + 1 if level + 1 < len(data['levels']) else 'complete'))

    return render_template('level.html', level=level, data=data['levels'][level])

@app.route('/level/complete')
def complete():
    return render_template('complete.html', score=session.get('score', 0), total=sum(len(l['questions']) for l in data['levels']))

if __name__ == '__main__':
    app.run(debug=True)
