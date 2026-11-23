// Terminal prompts for the admin account scripts, with hidden password typing.
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";

type TerminalPrompt = {
  ask: (question: string) => Promise<string>;
  askHidden: (question: string) => Promise<string>;
  close: () => void;
};

const createTerminalPrompt = (): TerminalPrompt => {
  // The prompts need a keyboard; without one (such as Claude Code's `!` prefix) readline
  // gets no input and Node exits with a confusing "unsettled top-level await" warning.
  if (!stdin.isTTY) {
    console.error(
      "Run this in your own terminal: it needs to read your typing.",
    );
    process.exit(1);
  }

  // readline echoes typed characters through its output stream, so the password prompt
  // swaps that stream for silence. The flag is the one piece of state readline needs.
  const echo = { isMuted: false };
  const terminalOutput = new Writable({
    write: (chunk, encoding, callback) => {
      if (!echo.isMuted) stdout.write(chunk, encoding);
      callback();
    },
  });
  const prompt = createInterface({
    input: stdin,
    output: terminalOutput,
    terminal: true,
  });

  const askHidden = async (question: string): Promise<string> => {
    stdout.write(question);
    echo.isMuted = true;
    const answer = await prompt.question("");
    echo.isMuted = false;
    stdout.write("\n");
    return answer;
  };

  return {
    ask: (question) => prompt.question(question),
    askHidden,
    close: () => prompt.close(),
  };
};

export default createTerminalPrompt;
