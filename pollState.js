let activePoll = null;

function startPoll(question, options) {
  activePoll = {
    question,
    options: options.map(opt => opt.trim().toLowerCase()),
    votes: {}, // username -> option
  };
}

function stopPoll() {
  const result = activePoll;
  activePoll = null;
  return result;
}

function vote(username, input) {
  if (!activePoll) return false;

  const option = input.trim().toLowerCase();
  if (!activePoll.options.includes(option)) return false;

  activePoll.votes[username] = option;
  return true;
}

function getResults() {
  if (!activePoll) return null;

  const tally = {};
  activePoll.options.forEach(opt => {
    tally[opt] = Object.values(activePoll.votes).filter(v => v === opt).length;
  });

  return { question: activePoll.question, results: tally, options: activePoll.options };
}

function isActive() {
  return activePoll !== null;
}

module.exports = { startPoll, stopPoll, vote, getResults, isActive };
