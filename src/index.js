const delimeterOptions = {
  space: "s",
  tab: "\t",
  comma: ",",
};

let hookRef = "";

let statusLabel = null;
let logTextarea = null;
let dataTextarea = null;

let contactsGenderData = null;

async function invoke() {
  if (contactsGenderData && contactsGenderData.length) {
    let currentIndex = 0;

    for (const { contactId, genderId } of contactsGenderData) {
      reportStatus(
        `processing ${++currentIndex} of ${contactsGenderData.length}`
      );
      log(`process contactId: ${contactId} ---> genderId: ${genderId}`);

      await delay(600);

      const result = await fetch(
        `${hookRef}?id=${contactId}&fields[UF_CRM_1700034619539]=${genderId}`, {
          method: "POST"
        }
      );

      log(result.ok ? ' - OK!\n' : ' - fail!\n');
    }

    reportStatus(`update complete! ${currentIndex} contacts processed`);
  } else {
    reportStatus("nothing to update");
  }
}

function parseData() {
  contactsGenderData = null;
  const delimeter =
    delimeterOptions[document.getElementById("delimeter-select").value];

  if (dataTextarea.value) {
    contactsGenderData = dataTextarea.value.split("\n").reduce((acc, item) => {
      const [contactId, genderId] = item.split(delimeter);
      acc.push({ contactId, genderId });
      return acc;
    }, []);

    contactsGenderData.forEach((item) => {
      log(`contactId: ${item.contactId} ---> genderId: ${item.genderId}\n`);
    });

    document.getElementById("invoke-button").disabled = false;

    reportStatus(`parse complete! ${contactsGenderData.length} items parsed`);
  } else {
    document.getElementById("invoke-button").disabled = true;
    reportStatus("nothing to parse");
  }
}

function reset() {
  logTextarea.value = "";
  dataTextarea.value = "";
  statusLabel.innerHTML = "";
  document.getElementById("invoke-button").disabled = true;
}

function reportStatus(msg) {
  statusLabel.innerHTML = msg;
}

function log(msg) {
  logTextarea.value += msg;
}

function delay(ms) {
  return new Promise((_) => setTimeout(_, ms));
}

window.addEventListener(
  "DOMContentLoaded",
  function () {
    statusLabel = document.getElementById("message-label");
    logTextarea = document.getElementById("log-textarea");
    dataTextarea = document.getElementById("data-textarea");
    hookRef = document.getElementById('webhook-url').value;
    

    this.document.getElementById('webhook-url').oninput = function(e) {
      hookRef = e.target.value;
      console.log(hookRef);
    }

    this.document
      .getElementById("invoke-button")
      .addEventListener("click", invoke);

    this.document
      .getElementById("parse-button")
      .addEventListener("click", parseData);

    this.document
      .getElementById("reset-button")
      .addEventListener("click", reset);

    reset();
  },
  true
);
