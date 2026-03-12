import { select } from '@inquirer/prompts';
import { questions } from '../data/questions.js';  
import chalk from 'chalk'; 

// asyn timer function: 10 sec per question 
async function askWithTimeout(question, timeoutMs = 10000) {
    const controller = new AbortController();
    const { signal } = controller;

    // Set timeout to abort
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        // allow selection for answer
        const answer = await select({
            message: question.message,
            choices: question.choices.map(c => ({ name: c, value: c })),
        }, { signal });
        
        clearTimeout(timeoutId); // Clear if answered
        return answer;
    } catch (error) {
        if (error.name === 'AbortPromptError') {
            return 'TIME_UP';
        }
        throw error;
    }
}


// run game 
export default async function runGame() {
    let score = 0;
    console.log(chalk.blue.bold('\n--- Welcome to 90s/00s Trivia Game! ---\n'));

    // iterate through questions 
    for (let i = 0; i < questions.length; i++) {

        // get current question object
        const q = questions[i]; 

        // question object for inquirer
        const promptQuestion = {
            type: 'list',
            name: q.name,
            message: `${chalk.yellow(`Question ${i + 1}/${questions.length}:`)} ${q.message}`,
            choices: q.choices,
        };
        
        // time prompt (10 sec)
        const answer = await askWithTimeout(promptQuestion, 10000);
    
        // evaluate answer
        // correct answer 
        if (answer === q.correct) {
            console.log(chalk.green('Correct\n'));
            score++;
        // time up 
        } else if (answer === 'TIME_UP') {
            console.log(chalk.yellow('Time is up!'));
            console.log(chalk.red(`Correct answer was: ${q.correct}\n`));
        // wrong answer 
        } else {
            console.log(chalk.red('Wrong'));
            console.log(chalk.red(`Correct answer was: ${q.correct}\n`));
        }

        // display current score after each question 
        console.log(chalk.cyan(`Current Score: ${score}/${i + 1}\n`));

    }

    // final results
    console.log(chalk.blue('--- Game Over! ---'));
    console.log(chalk.bold.yellow(`Final Score: ${score}/${questions.length}\n`));
}

// run the game
runGame();