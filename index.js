"use strict";
var APP_ID = '';  // TODO replace with your app ID (OPTIONAL).
var Alexa = require("alexa-sdk");
var AWS = require('aws-sdk');

var SKILL_STATES = {
    STARTSKILL: "_STARTSKILLMODE" // starting the skill.
    //, HELP: "_HELPMODE" // The user is asking for help.
};

var OP_STATES = {
    START: "_STARTMODE" // Start the operation.
    //, HELP: "_HELPMODE" // The user is asking for help.
};

var CHECKLIST_STATES = {
    START: "_STARTMODE", // Entry point, start the checklist.
    SIGNIN: "_SIGNUPMODE", // Asking signup questions.
    TIMEOUT:"_TIMEOUTMODE", // Asking timeout questions
    SIGNOUT:"_SIGNOUTMODE", //Asking signout questions
    HELP: "_HELPMODE" // The user is asking for help.
};
var VIDEO_STATES = {
    START: "_STARTMODE" // recording the video.
    //, HELP: "_HELPMODE" // The user is asking for help.
};
var PICTURE_STATES = {
    START: "_STARTMODE" // takes a picture
    //, HELP: "_HELPMODE" // The user is asking for help.
};
var RECORDER_STATES = {
    START: "_STARTMODE" // Recording started
    //, HELP: "_HELPMODE" // The user is asking for help.
};
var OPEND_STATES = {
    START: "_STARTMODE" // End the operation.
    //, HELP: "_HELPMODE" // The user is asking for help.
};


/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 */
var languageString = {
  "en-US": {
      "translation": {
          "WELCOME_MESSAGE": "Hello! I am your operating table assistant!" +
          "I am glad to assist you during the entire operation! Are you ready?",
          "WELCOME_MESSAGE_OPSTART": "Alright! You can now start the operation by telling me Start Operation," +
          "Or by telling me Start Operation along with the patient name",
          "OPSTART_CHOOSE_PATIENT": "Which patient do you want to choose? You have Max Mutterman, Kevin Davis and Martha Diaz on the list",
          "OPSTART_INTRA_OP": "Alright! I have setup the patient details. If you want to track the patients on the screen, please turn to the WHO checklist." +
          "Should I go on and start the checklist?",
          "WELCOME_MESSAGE_SIGNUP": "I will start the checkin process, at first," +
          "I would be asking you, some standard questions, prescribed by, World Health Organisation, to which you have to answer, yes or no!" +
          "Should I start signing up?",
          "FIRST_QUESTION_SIGNUP": "Has the patient confirmed identity, site, procedure and consent? " +
          "Please say yes or no ",
          "SECOND_QUESTION_SIGNUP": "Has the site been marked? Please say yes or no!",
          "THIRD_QUESTION_SIGNUP": "Has the anasthesia safety check been done? Please say yes or no!",
          "FOURTH_QUESTION_SIGNUP": "Is the pulse oximeter on the patient functioning? Please say yes or no!",
          "FIFTH_QUESTION_SIGNUP": "Does the patient have an allergy which is known? Please say yes or no!",
          "SIXTH_QUESTION_SIGNUP": "Does the patient have an aspiration risk? Please say yes or no!",
          "SIXTH_QUESTION_FOLLOWUP_SIGNUP" : "Please make sure there is assistance available ",
          "SEVENTH_QUESTION_SIGNUP": "Does the patient have an available risk, of more than 500 ml blood loss, in case of adults, or 7 ml per kg. incase of children?" +
          "Please say yes or no!",
          "SEVENTH_QUESTION_FOLLOWUP_SIGNUP": "Please make sure, adequate intravenous access, and fluids are planned.",
          "END_MESSAGE_SIGNUP": "Ok. Thank you for answering the questions. Your responses have been recorded! " +
          "The WHO checklist is now complete! Should the checklist be sent now?",
          "END_MESSAGE_SIGNUP_YES": "The WHO checklist is now sent. To configure the videorouting, please change to the core media view" +
          "You can now start the video routing where I can assist you to see the endo camera or the room camera" +
          "For example, you can tell me to show Roomcamera at Monitor 2 or show Endocam at Monitor 1",
          "END_MESSAGE_SIGNUP_NO": "The WHO checklist is not sent. To configure the videorouting, please change to the core media view." +
          "You can now start the video routing where I can assist you to see the endocamera or the room camera" +
          "For example, you can tell me to show Roomcamera at Monitor 2 or show Endo cam at Monitor 1",
          "ROUTINGMODE_ROOM_CAM": "Alright! Now you can see the Room Camera at Monitor 2" +
          "You can now perform recordings, create images, or change the video routing.",
          "ROUTINGMODE_ENDO_CAM": "Alright! Now you can see the Endo Camera at Monitor 1" +
          "You can now perform recordings, create images, or change the video routing" +
          "All you have to do is to tell me to take a picture or start the recordings.",
          "PICTURE_MESSAGE": "The picture from Monitor 1 has been saved.",
          "RECORDER_START": "The recorder 1 has been started. You can stop the recording anytime by telling me to stop it.",
          "RECORDER_STOP": "The recorder 1 has been stopped. Do you want to finish the Operation?",
          "ENDOP_MESSAGE": "Are all data ready to be sent?",
          "ENDOP_YES": "The operation has been finished and the data has been sent. Have a good day!",
          "ENDOP_NO" : "You have chosen not to send the data. The Operation is being continued. You can take picture or start the recording again.",
          "NEXT_QUESTION": "Thank you for answering! Shall we, proceed with the, next question?",
          "HELP_MESSAGE_LAUNCH": "I am unable to record your responses for now. Please try some other time!",
          "OPSTART_UNHANDLED": "I am unable to record your responses for now. Please try some other time",
          "CHECKLIST_UNHANDLED": "I am unable to record your responses for now. Please try some other time",
          "VIDEOROUTING_UNHANDLED": "I am unable to record your responses for now. Please try some other time",
          "PICTURE_UNHANDLED": "I am unable to record your responses for now. Please try some other time",
          "RECORDING_UNHANDLED": "I am unable to record your responses for now. Please try some other time",
          "OPEND_UNHANDLED": "I am unable to record your responses for now. Please try some other time",
          "STOP_MESSAGE": ['Wiedersehen! Goodbye! Hope everything went well! ', 'Hope I was able to assist you well! Goodbye for now', 'I hope you\'re doing good! Goodbye for now']
      }
  },
  "en-GB": {
      "translation": {
      }
  },
  "de-DE": {
      "translation": {
      }
  }
};


/**
* Handling session for the different states of the skill
**/
var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = SKILL_STATES.STARTSKILL;
        this.emitWithState("StartSkill");
        console.log("I am here in start skill 1");
    },
    "OPSTARTIntent": function () {
        console.log("I am in op start session: " + this.event.request.reason);
        this.handler.state = OP_STATES.START;
        this.emitWithState("StartOPState", true);
        console.log("I am here in OP Start 1");
    },
    "ChecklistIntent": function () {
        console.log("I am in checklist session: " + this.event.request.reason);
        this.handler.state = CHECKLIST_STATES.START;
        this.emitWithState("StartChecklist", true);
    },
    "VIDEOROUTINGIntent": function () {
        console.log("I am in video routing session: " + this.event.request.reason);
        this.handler.state = VIDEO_STATES.START;
        this.emitWithState("StartVideoRecord", true);
    },
    "PICTUREIntent": function () {
        console.log("I am in picture session: " + this.event.request.reason);
        this.handler.state = PICTURE_STATES.START;
        this.emitWithState("TakePicture", true);
    },
    "RECORDINGIntent": function () {
        console.log("I am in recording session: " + this.event.request.reason);
        this.handler.state = RECORDER_STATES.START;
        this.emitWithState("StartRecording", true);
    },
    "OPENDIntent": function () {
        console.log("I am in op end session: " + this.event.request.reason);
        this.handler.state = OPEND_STATES.START;
        this.emitWithState("EndOPState", true);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = SKILL_STATES.STARTSKILL;
        var speechOutput = this.t("HELP_MESSAGE_LAUNCH");
        this.emit(":ask", speechOutput);
    },
    "Unhandled": function () {
        this.handler.state = SKILL_STATES.STARTSKILL;
        var speechOutput = this.t("HELP_MESSAGE_LAUNCH");
        this.emit(":ask", speechOutput);
    }
};

/**
 * Start skill State Handlers
 */
var startskillStateHandlers = Alexa.CreateStateHandler(SKILL_STATES.STARTSKILL, {
    "LaunchRequest": function () {
        this.handler.state = SKILL_STATES.STARTSKILL;
        this.emitWithState("StartSkill");
        this.attributes['skillOpened'] = true;
        console.log("I am in launch request");
    },
    "StartSkill": function () {
        var greeting = "";
        var speechOutput = greeting + this.t("WELCOME_MESSAGE");
        this.emit(":ask", speechOutput, speechOutput);
        console.log("I am in start skill 2");
    },
    "OPSTARTIntent": function () {
        var speechOutput = this.t("WELCOME_MESSAGE_OPSTART");
        var repromptText = "";
        this.handler.state = OP_STATES.START;
        this.emitWithState("StartOP");
        console.log("I am in OP START");
    },
    "ChecklistIntent": function () {
        var speechOutput = this.t("WELCOME_QUESTION_SIGNUP");
        var repromptText = "";
        console.log("I am in checklist1: " + this.event.request.reason);
        this.handler.state = CHECKLIST_STATES.START;
        console.log("I am in checklist2: " + this.event.request.reason);
        this.emitWithState("StartChecklist", true);
    },
    "VIDEOROUTINGIntent": function () {
        console.log("I am in video routing session: " + this.event.request.reason);
        this.handler.state = VIDEO_STATES.START;
        this.emitWithState("StartVideoRecord", true);
    },
    "PICTUREIntent": function () {
        console.log("I am in picture session: " + this.event.request.reason);
        this.handler.state = PICTURE_STATES.START;
        this.emitWithState("TakePicture", true);
    },
    "RECORDINGIntent": function () {
        console.log("I am in recording session: " + this.event.request.reason);
        this.handler.state = RECORDER_STATES.START;
        this.emitWithState("StartRecording", true);
    },
    "OPENDIntent": function () {
        console.log("I am in op end session: " + this.event.request.reason);
        this.handler.state = OPEND_STATES.START;
        this.emitWithState("EndOPState", true);
    },
    "AMAZON.RepeatIntent": function () {
        this.emit(":ask", this.attributes["speechOutput"], this.attributes["repromptText"]);
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = this.t("HELP_MESSAGE_LAUNCH");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = SKILL_STATES.STARTSKILL;
        this.emit(":tell", selectMessage(this.t("STOP_MESSAGE")));   //this.t("CANCEL_MESSAGE")
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", selectMessage(this.t("STOP_MESSAGE")));
    },
    "Unhandled": function () {
        var greeting = "";
        var speechOutput = greeting + this.t("HELP_MESSAGE_LAUNCH");
        this.emit(":ask", speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in start skill state: " + this.event.request.reason);
        this.emit(":tell", selectMessage(this.t("STOP_MESSAGE")));
    }
});

/**
 * OP State Skill Handlers
 */
var opStartHandlers = Alexa.CreateStateHandler(OP_STATES.START, {
    "LaunchRequest": function () {
        this.handler.state = OP_STATES.START;
        console.log("I could be here");
        this.emitWithState("StartOP");
    },
    "Unhandled": function () {
        var speechOutput = this.t("OPSTART_UNHANDLED");
        this.emit(":ask", speechOutput);
    },
    "StartOP": function () {
        console.log("I am in StartOP: " + this.event.request.reason);
        var askMessage = this.t("WELCOME_MESSAGE_OPSTART");
        var speechOutput = this.t("WELCOME_MESSAGE_OPSTART");
        var repromptText = this.t("WELCOME_MESSAGE_OPSTART");
        this.emit(":ask", speechOutput, repromptText);
    },
    "ChoosePatient": function () {
        console.log("I am in StartOP: " + this.event.request.reason);
        var askMessage = this.t("OPSTART_CHOOSE_PATIENT");
        var speechOutput = this.t("OPSTART_CHOOSE_PATIENT");
        var repromptText = this.t("OPSTART_CHOOSE_PATIENT");
        this.emit(":ask", speechOutput, repromptText);
    },
    "IntraOP": function () {
        var msg = { payload: 'start_operation' };
        var sqs = new AWS.SQS({region:'us-east-1'});
        var sqsParams = {
        MessageBody: JSON.stringify(msg),
        QueueUrl: ''
      };
        AWS.config.update({accessKeyId: '', secretAccessKey: ''});
        sqs.sendMessage(sqsParams, function(err, data) {
        if (err) {
          console.log('ERR', err);
        }
        console.log(data);
      });
        console.log("I am in StartOP: " + this.event.request.reason);
        var askMessage = this.t("OPSTART_INTRA_OP");
        var speechOutput = this.t("OPSTART_INTRA_OP");
        var repromptText = this.t("OPSTART_INTRA_OP");
        this.emit(":ask", speechOutput, repromptText);
    }
});

/**
 * Checklist Skill Handlers
 */
var checklistStateHandlers = Alexa.CreateStateHandler(CHECKLIST_STATES.START, {
    "LaunchRequest": function () {
        this.handler.state = CHECKLIST_STATES.START;
        this.emitWithState("StartChecklist");
    },
    "Unhandled": function () {
        var speechOutput = this.t("CHECKLIST_UNHANDLED");
        this.emit(":ask", speechOutput);
    },
    "StartChecklist": function () {
        console.log("I am in checklist3: " + this.event.request.reason);
        var askMessage = this.t("WELCOME_MESSAGE_SIGNUP");
        var speechOutput = this.t("WELCOME_MESSAGE_SIGNUP");
        var repromptText = this.t("WELCOME_MESSAGE_SIGNUP");
        this.emit(":ask", speechOutput, repromptText);
    },
    "SignUp": function () {
        console.log("I am in checklist3: " + this.event.request.reason);
        var askMessage = this.t("FIRST_QUESTION_SIGNUP");
        var speechOutput = this.t("FIRST_QUESTION_SIGNUP");
        var repromptText = this.t("FIRST_QUESTION_SIGNUP");
        this.attributes["counter"]=1;
        console.log("Question 1:" + this.attributes);
        this.emit(":ask", speechOutput);
    },
    "BeginQuestion": function () {
        console.log("I am in checklist3: " + this.event.request.reason);
        switch(this.attributes["counter"]){
        case 1:
        var askMessage = this.t("SECOND_QUESTION_SIGNUP");
        var speechOutput = this.t("SECOND_QUESTION_SIGNUP");
        var repromptText = this.t("SECOND_QUESTION_SIGNUP");
        this.attributes["counter"]++;
        this.emit(":ask", speechOutput, repromptText);
        console.log("Question 2:" + this.attributes);
        break;

        case 2:
        askMessage = this.t("THIRD_QUESTION_SIGNUP");
        speechOutput = this.t("THIRD_QUESTION_SIGNUP");
        repromptText = this.t("THIRD_QUESTION_SIGNUP");
        this.attributes["counter"]++;
        this.emit(":ask", speechOutput, repromptText);
        console.log("Question 3:" + this.attributes);
        break;

        case 3:
        askMessage = this.t("FOURTH_QUESTION_SIGNUP");
        speechOutput = this.t("FOURTH_QUESTION_SIGNUP");
        repromptText = this.t("FOURTH_QUESTION_SIGNUP");
        this.attributes["counter"]++;
        this.emit(":ask", speechOutput, repromptText);
        console.log("Question 4:" + this.attributes);
        break;

        case 4:
        askMessage = this.t("FIFTH_QUESTION_SIGNUP");
        speechOutput = this.t("FIFTH_QUESTION_SIGNUP");
        repromptText = this.t("FIFTH_QUESTION_SIGNUP");
        this.attributes["counter"]++;
        this.emit(":ask", speechOutput, repromptText);
        console.log("Question 5:" + this.attributes);
        break;

        case 5:
        askMessage = this.t("SIXTH_QUESTION_SIGNUP");
        speechOutput = this.t("SIXTH_QUESTION_SIGNUP");
        repromptText = this.t("SIXTH_QUESTION_SIGNUP");
        this.attributes["counter"]++;
        this.emit(":ask", speechOutput, repromptText);
        console.log("Question 6:" + this.attributes);
        break;

        case 6:
        askMessage = this.t("SEVENTH_QUESTION_SIGNUP");
        speechOutput = this.t("SEVENTH_QUESTION_SIGNUP");
        repromptText = this.t("SEVENTH_QUESTION_SIGNUP");
        this.attributes["counter"]++;
        this.emit(":ask", speechOutput, repromptText);
        console.log("Question 7:" + this.attributes);
        break;

        case 7:
        askMessage = this.t("END_MESSAGE_SIGNUP");
        speechOutput = this.t("END_MESSAGE_SIGNUP");
        this.attributes["counter"]++;
        this.emit(":ask", speechOutput);
        this.emitWithState("IntraOPYes");
        break;
        }
    },
});


/**
 * Video Skill Handlers
 */
var videoStartHandlers = Alexa.CreateStateHandler(VIDEO_STATES.START, {
    "LaunchRequest": function () {
        this.handler.state = VIDEO_STATES.START;
        this.emitWithState("IntraOPYes");
    },
    "Unhandled": function () {
        var speechOutput = this.t("VIDEOROUTING_UNHANDLED");
        this.emit(":ask", speechOutput);
    },
    "IntraOPYes": function () {
        var askMessage = this.t("END_MESSAGE_SIGNUP_YES");
        var speechOutput = this.t("END_MESSAGE_SIGNUP_YES");
        this.emit(":ask", speechOutput);
    },
    "IntraOPNo": function () {
        var askMessage = this.t("END_MESSAGE_SIGNUP_NO");
        var speechOutput = this.t("END_MESSAGE_SIGNUP_NO");
        this.emit(":ask", speechOutput);
    },
    "IntraOPRoom": function () {
        var askMessage = this.t("ROUTINGMODE_ROOM_CAM");
        var speechOutput = this.t("ROUTINGMODE_ROOM_CAM");
        this.emit(":ask", speechOutput);
    },
    "IntraOPEndo": function () {
        var askMessage = this.t("ROUTINGMODE_ENDO_CAM");
        var speechOutput = this.t("ROUTINGMODE_ENDO_CAM");
        this.emit(":ask", speechOutput);
    }
});

/**
 * Picture Skill Handlers
 */
var pictureStartHandlers = Alexa.CreateStateHandler(PICTURE_STATES.START, {
  "LaunchRequest": function () {
      this.handler.state = PICTURE_STATES.START;
      this.emitWithState("TakePicture");
  },
  "Unhandled": function () {
      var speechOutput = this.t("PICTURE_UNHANDLED");
      this.emit(":ask", speechOutput);
  },
  "TakePicture": function () {
      var msg = { payload: 'take_picture' };
      var sqs = new AWS.SQS({region:'us-east-1'});
      var sqsParams = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: ''
  };
      AWS.config.update({accessKeyId: '', secretAccessKey: ''});
      sqs.sendMessage(sqsParams, function(err, data) {
      if (err) {
      console.log('ERR', err);
    }
      console.log(data);
  });
      var askMessage = this.t("PICTURE_MESSAGE");
      var speechOutput = this.t("PICTURE_MESSAGE");
      this.emit(":ask", speechOutput);
  }
});

/**
 * Recorder Skill Handlers
 */
var recorderStartHandlers = Alexa.CreateStateHandler(RECORDER_STATES.START, {
  "LaunchRequest": function () {
      this.handler.state = RECORDER_STATES.START;
      this.emitWithState("StartRecorder");
  },
  "Unhandled": function () {
      var speechOutput = this.t("RECORDING_UNHANDLED");
      this.emit(":ask", speechOutput);
  },
  "StartRecorder": function () {
      var msg = { payload: 'start_recording' };
      var sqs = new AWS.SQS({region:'us-east-1'});
      var sqsParams = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: ''
  };
      AWS.config.update({accessKeyId: '', secretAccessKey: ''});
      sqs.sendMessage(sqsParams, function(err, data) {
        if (err) {
      console.log('ERR', err);
    }
      console.log(data);
  });
      var askMessage = this.t("RECORDER_START");
      var speechOutput = this.t("RECORDER_START");
      this.emit(":ask", speechOutput);
  },
  "StopRecorder": function () {
      var msg = { payload: 'stop_recording' };
      var sqs = new AWS.SQS({region:'us-east-1'});
      var sqsParams = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: ''
  };
      AWS.config.update({accessKeyId: '', secretAccessKey: ''});
      sqs.sendMessage(sqsParams, function(err, data) {
      if (err) {
      console.log('ERR', err);
    }
      console.log(data);
  });
      var askMessage = this.t("RECORDER_STOP");
      var speechOutput = this.t("RECORDER_STOP");
      this.emit(":ask", speechOutput);
  }
});

/**
 * End Operation Skill Handlers
 */
var OPEndHandlers = Alexa.CreateStateHandler(OPEND_STATES.START, {
  "LaunchRequest": function () {
      this.handler.state = OPEND_STATES.START;
      this.emitWithState("EndOP");
  },
  "Unhandled": function () {
      var speechOutput = this.t("OPEND_UNHANDLED");
      this.emit(":ask", speechOutput);
  },
  "EndOP": function () {
      var askMessage = this.t("end");
      var speechOutput = this.t("ENDOP_MESSAGE");
      this.emit(":ask", speechOutput);
  },
  "EndOPYes": function () {
      var msg = { payload: 'end_operation' };
      var sqs = new AWS.SQS({region:'us-east-1'});
      var sqsParams = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: ''
  };
      AWS.config.update({accessKeyId: '', secretAccessKey: ''});
      sqs.sendMessage(sqsParams, function(err, data) {
        if (err) {
      console.log('ERR', err);
    }
      console.log(data);
  });
      var askMessage = this.t("end");
      var speechOutput = this.t("ENDOP_YES");
      this.emit(":ask", speechOutput);
  },
  "EndOPNo": function () {
      var askMessage = this.t("end");
      var speechOutput = this.t("ENDOP_NO");
      this.emit(":ask", speechOutput);
  }
});

function selectMessage(messageList) {

        var randomMessageIndex = Math.floor(Math.random() * messageList.length);
        var message = messageList[randomMessageIndex];

        return message;
    }


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageString;
    alexa.dynamoDBTableName = 'ChecklistResponses';
    alexa.registerHandlers(newSessionHandlers, startskillStateHandlers, checklistStateHandlers, opStartHandlers, videoStartHandlers, pictureStartHandlers, recorderStartHandlers, OPEndHandlers);
    alexa.execute();
};
