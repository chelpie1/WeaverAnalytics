import flask
from flask import Flask, render_template, request, url_for, redirect
import os
import glob
import json
import base64
import ipdb 
import numpy as np
from PIL import Image

app = Flask(__name__ )
app.debug = True

imageDict = {}

facialPath = r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\FacialImages\\'
for classes in os.listdir(facialPath)[0:3]:
	
	files = [x for x in os.listdir( facialPath + classes ) if x[-3:] == 'pgm' ][0:5] 
	
	temp = []
	for x in files:
		iMatrix =  np.array(Image.open(facialPath + classes + '\\' + x)).flatten().tolist()
		place = np.array(Image.open(facialPath + classes + '\\' + x))
		iMatrix = [ v for v in iMatrix for _ in (0,1,2,3)  ] 
		iMatrix[3::4] = int(len(iMatrix)/4)*[255]
		w = [ x, json.dumps(iMatrix) ]
		
		temp.append(w)
		
	# pics = [ [x, json.dumps( [ v for v in np.array(Image.open(facialPath + filename + '\\' + x)).flatten().tolist() for _ in (0,1,2,3)  ]  )  ] for x in files ]

	
	imageDict[classes]  = temp

@app.route("/", methods = ["GET","POST"])
def index():
								   
	return render_template('index.html' , images = imageDict)





@app.route("/imageAnalysis", methods = ["POST"])
def imageAnalysis():
	print(request.form['image'])
	
	image = request.form['image'].split(',')[1]
	image = base64.b64decode(image)

	with open(r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\test.png', 'wb+') as f:
		f.write(image)
	
	img = Image.open(r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\test.png').convert('RGBA')
	matrix = np.array(img)

	
	return '0' 
	


if __name__ == "__main__":
    app.run(port=5015)