# Chesstopia
### Description
- Chesstopia is a website for users to play chess with friends or an AI opponent in real time over the web.

### Links
- <a href="https://www.jacob-ferrell.com/chesstopia">Live Demo</a>
- <a href="https://github.com/jacob-ferrell/online-chess-backend">Backend Repository</a>

### Screenshots
<div style="display: flex; gap: 2rem;">
  <img src="images/dashboard.jpg" alt="Image 1" style="margin-right: 10px;" width="300" height="auto">
  <img src="images/game.jpg" alt="Image 2" width="300" height="auto">
</div>

### Project Goals
- Become familiar with Java and Spring framework
- Expand knowledge of OOP principles
- Become familiar with websockets and which situations they are most practical for

### Features
- Mobile-first UI
- Authorization/Authentication 
- Through the use of websockets games can be played in real-time and users can be notified of updates to ongoing games.
- Users can add other users to their friends list by their email, allowing them to quickly challenge them to games
- Also through the use of websockets, notification alerts are displayed immediately for changes to the user's games and when another user adds them to their friends list
- All game logic is computed and verified from the backend
- A matchmaking system which places users in a lobby and immediately matches them and starts a new game with any other players who have also entered the matchmaking lobby.
- An AI opponent which can be challenged from the matchmaking("Quick Play") lobby.
- Users can click "Sign In As Demo User" from the login page to quickly demo the site without creating an account

### Technologies Used
- React
- Java/Spring Boot
- PostgreSQL 

### AI Capabilities
- The computer AI is very basic.  It will make a random move for a random piece. However, it will always prioritize moves that result in checkmate, check, or the loss of a piece for the opposing player (the user), in that order.

### Demo User
- When users click "Sign In As Demo User" from the login page, it generates a unique demo account
- One friend (my account on the site) is added to the demo user's friends list and is viewable from the "My Friends" tab
- Two games are created and are viewable from the "My Games" tab
- One of the games is against the computer AI and is immediately playable by clicking on the game info under "My Games"
- One of the games is against another player (myself)
- When a new game is created, white and black piece color is randomly assigned.  Meaning it might not be immediately possible to make a move in the game against the non-AI user, since the demo user's piece color could be black for that game
