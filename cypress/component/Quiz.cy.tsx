import Quiz from '../../client/src/components/Quiz';

describe('Quiz', () => {
    it('should render the quiz React component entirely', () => {
        cy.mount(<Quiz />);
    });

    it('should render the title text on the screen', () => {
        cy.mount(<Quiz />);
        cy.get('h1').should('have.text', 'Welcome to the Code Quiz!');
    });

    it('should render the start button', () => {
        cy.mount(<Quiz />);
        cy.contains('Start Quiz').should('exist');
    });

    it('should render the component housing the questions', () => {
        cy.mount(<Quiz />);
        cy.contains('Start Quiz').click();
        cy.wait(500);
        cy.get('.card h2').should('exist');
    });

    it('should render 4 buttons for each question', () => {
        cy.mount(<Quiz />);
        cy.contains('Start Quiz').click();
        cy.wait(500);
        cy.get('.btn-primary').should('have.length', 4);
    });

    it('should render the question data from the db', () => {
        cy.log('Mounting the Quiz component');
        cy.mount(<Quiz />);

        cy.log('Setting up API intercept for /api/questions/random');
        cy.intercept('GET', '/api/questions/random', {
            statusCode: 200,
            fixture: 'questions.json', // Use the updated questions.json file
        }).as('getQuestions');

        cy.log('API intercept set. Waiting for Start Quiz click.');
        cy.contains('Start Quiz').click();

        cy.log('Start Quiz clicked. Waiting for API request to be intercepted.');
        cy.wait('@getQuestions').then((interception) => {
            cy.log('Intercepted request:', interception.request);
            cy.log('Intercepted response:', interception.response);
        });

        cy.log('Verifying that the first question is rendered.');
        cy.findByText('What is the output of `console.log(typeof null)` in JavaScript?').should('be.visible');
    });

    it('should keep track of correct answers and display the correct score', () => {
        cy.log('Mounting the Quiz component');
        cy.mount(<Quiz />);
        cy.log('Setting up API intercept for /api/questions/random');
        cy.intercept('GET', '/api/questions/random', {
            statusCode: 200,
            fixture: 'questions.json', // Use the updated questions.json file
        }).as('getQuestions');

        cy.log('API intercept set. Waiting for Start Quiz click.');
        cy.contains('Start Quiz').click();

        cy.wait('@getQuestions').then((interception) => {
            cy.log('Intercepted request:', interception.request);
            cy.log('Intercepted response:', interception.response);
        });

        cy.log('Answering all questions.');
        for (let i = 0; i < 10; i++) {
            cy.get('.btn-primary').eq(2).click(); // Assuming the correct answer is always the third button
            cy.wait(500);
        }

        cy.log('Verifying the final score is displayed.');
        cy.get('[data-cy="score"]').should('be.visible');
    });

    it('should display the quiz completed message after answering all questions', () => {
        cy.mount(<Quiz />);
        cy.contains('Start Quiz').click();
        cy.wait(500);
        cy.log('Answering all questions.');
        for (let i = 0; i < 10; i++) {
            cy.get('.btn-primary').eq(2).click(); // Assuming the correct answer is always the third button
            cy.wait(500);
        }
        cy.contains('Quiz Completed').should('be.visible');
    });

    it('should render the button to take a new quiz after the quiz is over', () => {
        cy.mount(<Quiz />);
        cy.contains('Start Quiz').click();
        cy.wait(500);
        cy.log('Answering all questions.');
        for (let i = 0; i < 10; i++) {
            cy.get('.btn-primary').eq(2).click(); // Assuming the correct answer is always the third button
            cy.wait(500);
        }
        cy.contains('Take New Quiz').should('exist');
    });
});