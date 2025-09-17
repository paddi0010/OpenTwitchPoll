let activePoll = null;

function startPoll(poll) {
  polls = [poll];
  io.emit("updatePolls", polls); 
}

function updateVotes(updatedPoll) {
  if (!polls.length) return;
  polls[0].votes = updatedPoll.votes;
  io.emit("updatePolls", polls); 
}

function stopPoll() {
  polls = [];
  io.emit("updatePolls", polls);
}


function getResults() {
  if (!activePoll) return null;

  const tally = {};
  activePoll.options.forEach(opt => {
    tally[opt] = Object.values(activePoll.votes).flat() .filter(v => v === opt).length;
  });

  return { question: activePoll.question, results: tally, options: activePoll.options };
}


function isActive() {
  return activePoll !== null;
}

module.exports = { startPoll, stopPoll, vote, getResults, isActive };
