document.addEventListener("DOMContentLoaded", async () => {
  const queryParam = async (param) => {
    const urlParam = new URLSearchParams(window.location.search);
    return urlParam.get(param);
  };
  const myUsername = document.getElementById("my-username");
  const username = await queryParam("user") || sessionStorage.getItem("username");
  if(!username){
    myUsername.innerText = "Hello, User!";
  }else{
    myUsername.innerText = `Hello, ${username}!`;
  };
  const renderPolls = async (polls) => {
    const pollsList = document.getElementById("polls-list");
    pollsList.innerHTML = "";
    if(polls.length === 0){
      pollsList.innerHTML = "<p>No polls have found.</p>";
    }
    polls.forEach(poll => {
      const pollDiv = document.createElement("div");
      pollDiv.className = "p-3 my-4 border border-dark border-1 bg-white";
      pollDiv.innerHTML = `<p>Created by: <strong>${poll.username}</strong></p>`;
      pollDiv.id = "poll-div";
      const pollOptionsDiv = document.createElement("div");
      pollOptionsDiv.className = "d-flex justify-content-center gap-2";
      pollOptionsDiv.id = "options-div";
      poll.options.forEach((option, index) => {
        const optionsList = document.createElement("div");
        optionsList.className = "d-flex align-items-center gap-1";
        const optionsBtn = document.createElement("button");
        optionsBtn.className = "p-2 border border-2 border-secondary rounded text-uppercase fw-bold";
        optionsBtn.innerText = option;
        optionsBtn.addEventListener("click", () => {
          voteOption(poll._id, index, chart);
        });
        const voteNum = document.createElement("span");
        voteNum.innerText = `${poll.votes[index]} votes`;
        optionsList.appendChild(optionsBtn);
        optionsList.appendChild(voteNum);
        pollOptionsDiv.appendChild(optionsList);
      });
      pollDiv.appendChild(pollOptionsDiv);
      pollsList.appendChild(pollDiv);
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 200;
      canvas.id = `chart=${poll._id}`;
      pollDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: poll.options,
          datasets: [{
            data: poll.votes,
            backgroundColor: [randomColor(),randomColor(),randomColor()],
            borderColor: "black",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: poll.question,
              font:{
                size: 20
              }
            }
          }
        }
      });
    });
  };
  const randomColor = () => {
    const colors = ["red","orange","yellow","green","blue","indigo","violet"];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
  };
  const voteOption = async (pollId, optionIndex, chart) => {
    try{
      const res = await fetch("/polls/votes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({pollId, optionIndex})
      });
      if(res.ok){
        alert("Your vote has been added.");
        updateChart(pollId, chart);
      }else{
        alert("Failed to register vote.");
      };
    }catch(error){
      console.error(error);
    }
  };
  const updateChart = async (pollId, chart) => {
    try{
      const res = await fetch(`/polls/mypolls?user=${username}`);
      const poll = await res.json();
      const updatePoll = poll.find(p => p._id === pollId);
      if(updatePoll){
        chart.data.datasets[0].data = updatePoll.votes;
        chart.update();
      };
    }catch(error){
      console.error(error);
    }
  };
  const fetchPolls = async () => {
    try{
      const res = await fetch(`/polls/mypolls?user=${username}`);
      const poll = await res.json();
      renderPolls(poll);
    }catch(error){
      console.error(error);
    }
  };
  fetchPolls();
});