Summary: 
This Test suite scope covers Login flows, Registration flows, and CRUD for the Projects section of the application, the tests follow an AAA Pattern. 


Test Plan:

Login Flow:
- Test the Login fLow with valid credentials 
- Test the login flow with invalid credentials 
- Test the Login flow when too many requests are made due to invalid credentials

User Registration:
- Test a Successful New User Registration flow
- Test "User already exists" exception
- Test "Email already exists" exception

CRUD:
- Test the successful creation of a Project
- Test the successful update of a project's details/tasks
- Test the successful Reading/Opening of a task and reading the contents
- Test the succsessful Deletion of a project

Why these cases:
I chose to cover these cases as they felt high priority and impact the user experience very directly. I made sure to cover negative scenarios where possible and exceptions as well. 
    
I thought of covering the Forget Password as well, since it is fairly simple flow but it felt like Login, Registration, and CRUD were enough and within scope and the email reaching the user becomes more of an external thing.

I couldn't really cover crud sad path or negative/error scenarios as there were no real ways to cause errors in the CRUD without running multiple insatnces/tab of the same account which is resolved by a refresh from the user side, might be a bit out of scope discussing refresh tokens.

In Summary, I felt these cases covered the requirements while demosntarting my understanding of automated testing and QA in General.

Design Choices:
The Structure is composed of a Base Test file containing a beforeEach and aftereach for very basic environment setup and teardown, while every test case is in its own spec file for maintaining and updating them without breaking each other. the spec files are segregated in a series of subfolders in the "Test Cases" folder in the main "Tests" folder. 
The goal was to keep eveyrthing nice and organized and trackable. API Validation was sth I decided based on importance, such as login flows and user registration would include API validation. all tests have unique tags to run them independently through the terminal, clicking on them in the IDE is also a valid option. I also used an AAA Pattern.

How To Run:
Assuming you have eveything set up as intended simply type: "npx playwright test --grep @(whatever tag the test you want to test has)"
This way, you can run every test individually for most accurate results and not cause errors from overloading the login requests espeically if you want test on multiple browser engines which is the default

Alternatively, you can simply click run on the file in your IDE or the little green arrow next to the code.
