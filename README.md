# CAMILLE VS Code Extension

The following extension allows you to use the CAMILLE Chatbot through a graphical interface directly within Visual Studio Code. CAMILLE is a Chatbot to support machine learning engineers to identify and remove ML-Specific Code Smells that can arise during the various ML pipelines`stages. 

More about CAMILLE: https://github.com/FrancescoPinto02/CAMILLE



## Features
Thanks to this extension you will be able to take advantage of CAMILLE`s features:

* You can request information and examples about 22 ML-Specific Code Smells.
* You can request an analysis of your GitHub repository, view the report and download it.
* You can ask for personalized refactoring suggestions to remove Code Smells detected within your code.


## Requirements
* <a href="https://github.com/FrancescoPinto02/CAMILLE">CAMILLE</a>
* <a href="https://code.visualstudio.com/">Visual Studio Code</a>
* <a href="https://nodejs.org/en">Node.js</a>


## How to Install
STEP 1: Cloning the repository
```bash
git clone https://github.com/FrancescoPinto02/CamilleExtension.git
```

STEP 2: Go to the project`s main folder
```bash
cd CamilleExtension
```

STEP 3: Install the dependencies
```bash
npm i
```

## How to Run
REQUIREMENTS: Make sure you have installed and started CAMILLE (enabling API) by following the steps reported in its repository.

STEP 1: Inside the editor, open ```src/extension.ts``` and press ```F5```

STEP 2: In the new windows, open the Command Palette by pressing ```Ctrl+Shift+P```

STEP 3: Run the command ```Chat with Camille``` inside the command palette
