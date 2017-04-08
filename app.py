import flask
from flask import Flask, render_template, request, url_for, redirect
import os
import glob
import json
import base64

app = Flask(__name__)
app.debug = True


@app.route("/", methods = ["GET","POST"])
def index():
								   
	return render_template('index.html')





@app.route("/imageAnalysis", methods = ["POST"])
def imageAnalysis():
	print(request.form['image'])
	
	image = request.form['image']
	head, data = image.split(',')

	data = base64.b64decode(data)
	
	with open(r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\test.png', 'w+') as f:
		f.write(data)
			
	
	return '0' 
	


if __name__ == "__main__":
    app.run(host='192.168.0.106',port=5013)