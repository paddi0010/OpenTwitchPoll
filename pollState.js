let activePoll = null;

// Start a new poll
function startPoll(question, options) {
  // Store options in lowercase and trimmed
  activePoll = {
    question,
    options: options.map(opt => opt.trim().toLowerCase()),
    votes: {}, // username -> option
  };
}

// Stop the current poll and return its state
function stopPoll() {
  const result = activePoll;
  activePoll = null;
  return result;
}

// Cast a vote for a given username
function vote(username, input) {
  if (!activePoll) return false;

  const option = input.trim().toLowerCase(); // lowercase and trim

  if (!activePoll.options.includes(option)) return false;

  activePoll.votes[username] = option;
  return true;
}

// Get current poll results
function getResults() {
  if (!activePoll) return null;

  const tally = {};
  activePoll.options.forEach(opt => {
    tally[opt] = Object.values(activePoll.votes).filter(v => v === opt).length;
  });

  return { question: activePoll.question, results: tally, options: activePoll.options };
}

// Check if a poll is currently active
function isActive() {
  return activePoll !== null;
}

module.exports = { startPoll, stopPoll, vote, getResults, isActive };
