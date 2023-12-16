# Werewolf Game Frontend Documentation

![Werewolf Ethereum Integration](public/md_wallpaper.png)

## Introduction

This document provides an in-depth guide to the frontend implementation of the Werewolf Game, a blockchain-based adaptation of the classic social deduction game. Our frontend interface is designed to provide a seamless and interactive experience for players, complementing the secure and transparent backend built on blockchain technology.

The frontend is crucial for player engagement, offering an intuitive and visually appealing interface for game interactions. It includes features such as real-time updates, encrypted role revelation, voting mechanisms, and game progression displays, all integrated with the blockchain backend.

### Key Features

- **User-Friendly Interface**: Designed for ease of use, ensuring players can focus on the game strategy.
- **Real-Time Game Updates**: Reflects the game's progression in real-time, enhancing the immersive experience.
- **Secure Player Interaction**: Interactions are secure and integrated with the backend's encrypted operations.
- **Adaptive Design**: Responsive design that works across various devices and screen sizes.

## Installation

### Prerequisites

- Node.js and npm or yarn installed
- Access to the backend repository and its deployed address
- Metamask installed in your browser for interacting with the blockchain

### Steps

1. **Clone the Repository**: 
   Clone the frontend repository to your local machine.
   ```bash
   git clone https://github.com/Qtty/loup-garou-frontend.git
   ```
2. **Install Dependencies**: Navigate to the frontend directory and install the necessary dependencies.
    ```bash
    npm install
    ```
3. **Configuration**: Update the configuration files(ContextProvider.tsx) to point to the deployed backend smart contract.
4. **Run the Application**: Start the frontend application locally.
    ```bash
    npm run dev
    ```
5. **Build for Production (optional)**: Build the application for production deployment.
    ```bash
    npm build
    ```
## Chat Server Setup

### Overview

Alongside the frontend and smart contract, our project includes a small chat server written in Flask. This server handles real-time messaging for the game, allowing players to communicate during gameplay.

### Setting Up the Chat Server

#### Prerequisites

- Python installed on your machine.

#### Steps

1. **Navigate to the Chat Server Directory**:
    ```bash
    cd chat-server
    ```
2. **Create a new Virtual Env for Python3**:
    ```bash
    python3 -m venv venv
    ```
3. **Activate the Virtual Environment**:
    ```bash
    source venv/bin/activate
    ```
4. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
5. **Launch the Chat Server**:
    ```bash
    python chat.py
    ```

This section provides clear instructions on how to set up the Flask-based chat server, ensuring users can easily integrate it with the rest of the project components.

## Frontend Components Breakdown

### Introduction to Frontend Architecture

The frontend of the Werewolf Game is built using React.js, Vite, and TypeScript. This combination offers a robust and scalable architecture, enabling the creation of a dynamic and responsive user interface. React.js provides the reactive components, Vite offers an optimized build tool with fast refresh capabilities, and TypeScript brings strong typing to enhance code reliability and maintainability.

Our frontend is designed to be intuitive and engaging, ensuring that players can seamlessly interact with the game's features. Below is a breakdown of the key components that constitute the frontend of the Werewolf Game.

### Component Breakdown

#### App.tsx Component Breakdown

##### Overview
`App.tsx` is the root component in the React application for the Werewolf Game. It serves as the primary entry point for the user interface and orchestrates the routing and main structure of the application.

##### Key Features
- **Routing**: Utilizes React Router (`BrowserRouter`, `Routes`, `Route`) to manage navigation within the app.
- **FHEVM Library Initialization**: Includes an `useEffect` hook that initializes the FHEVM library on component mount.
- **Page Layout**: Defines the main layout and routes for different game states (Main content, Game Over, Wolves Win, Villagers Win).

##### Components and Routes
- `MainContent`: The main interface of the game, displayed at the root route ("/").
- `GameOver`: Displayed when the game ends when the player dies, at the "/game-over" route.
- `WolvesWin`: Shown when the wolves win the game, accessible at the "/wolves-win" route.
- `VillagersWin`: Rendered when the villagers win, located at the "/villagers-win" route.

##### Context Provider
- `ContractProvider`: Wraps the entire application to provide a global state for blockchain contract interactions.

##### Styling
- The component includes `App.css` for styling the overall layout and appearance.

#### ContractProvider.tsx Component Breakdown

##### Overview
`ContractProvider.tsx` serves as a context provider in the Werewolf game frontend, managing Ethereum blockchain interactions and game state.

##### Key Features
- **Ethereum Integration**: Handles Ethereum provider and smart contract instances.
- **State Management**: Manages player data, game phases, and contract-related states using React's `useState`.
- **Context Provision**: Supplies essential blockchain and game state data to child components.

##### Functionality
- **Provider Setup**: Initializes and updates the Ethereum provider and contract.
- **Game Phase Handling**: Controls and transitions the game phases based on predefined rules and timings.
- **Player Registration**: Tracks player registration status and updates player data.

##### Usage
- **Context Creation**: Creates a `ContractContext` for global state management.
- **Custom Hook**: Provides a `useContract` hook for easy access to the context in other components.
- **Error Handling**: Ensures proper usage within the provider's scope.

##### Implementation Details
- Manages ABI and contract address for the smart contract.
- Defines a structure for the context state, including blockchain-related information and player data.
- Implements useEffect hooks for dynamic updates based on contract interaction and game progress.


#### Registration Component Breakdown

##### Overview
The `Registration` component in the Werewolf game frontend manages the process of player registration, interfacing with Ethereum blockchain via Metamask and the game's smart contract.

##### Key Features
- **State Management**: Utilizes React states for managing loading status (`isLoading`), transaction waiting status (`isWaitingForTx`), remaining players to register (`playersLeft`), and registration errors (`registrationError`).
- **Blockchain Interaction**: 
  - Connects with Ethereum blockchain through Metamask for user authentication and transaction handling.
  - Interacts with the smart contract to register players and fetch the count of players left to register.
- **Ethereum Account Request**: Requests user's Ethereum account access using `window.ethereum.request`.
- **Smart Contract Interaction**:
  - Creates a new Ethereum provider and signer.
  - Initializes a new contract instance for transaction submission (`newContract.registerForGame`).
- **User Feedback**:
  - Displays loading indicators, registration status, and error messages.
  - Updates UI based on transaction status and registration progress.

##### UI Components
- **Loading Indicator**: Shows a loading message along with the number of players left to register.
- **Registration Button**: Allows users to initiate the registration process.
- **Error Notification**: Displays any errors encountered during registration, such as failed transactions or issues connecting to Metamask.

##### Registration Flow
1. User clicks the "Register for Game" button.
2. The app requests Metamask access and submits a registration transaction to the smart contract.
3. Displays the registration status and updates the number of players left to register.

##### Styling
- The component uses `Registration.css` for styling, providing a visually appealing registration interface.

#### MainContent Component Breakdown

##### Overview
`MainContent` acts as the central hub in the Werewolf game's frontend, dynamically rendering different components based on the player's registration status.

##### Functionality
- **Conditional Rendering**: Displays either the game interface or the registration component based on the player's registration status.
- **Integration with Contract Context**: Uses `useContract` to access the player's registration status from the global state.

##### Components Rendered
- **Registration**: Shown to players who are not yet registered.
- **Game Components**: When registered, it displays:
  - `StatusBar`: Shows the game's status and current phase.
  - `Player`: Renders the individual player's information.
  - `PlayerList`: Displays a list of all players in the game.
  - `ChatBox`: Provides a chat interface for player communication.

##### Usage
Serves as the primary content renderer, ensuring users see the appropriate interface based on their game participation status.

#### StatusBar Component

##### Overview
The `StatusBar` component in the Werewolf game frontend displays the current game phase and remaining time, along with the player's role.

##### Technical and Logical Breakdown
- **State and Context Management**:
  - Utilizes `useContract` to access the game's current phase and player information.
  - Manages a `timeLeft` state to track the countdown for the current phase.

- **Phase Durations**:
  - Defines `phaseDurations`, an object mapping each phase to its duration in seconds.

- **Time Formatting**:
  - Implements `formatTimeLeft` to convert remaining time into a `mm:ss` format for display.

- **Timer Logic**:
  - `useEffect` hook sets the initial `timeLeft` when the phase changes and updates it every second.
  - Implements a countdown mechanism that decreases `timeLeft` by one every second and stops at zero.

- **UI Components**:
  - Displays the current phase, formatted time left, and the player's role.
  - Uses a fixed position to ensure visibility on the screen.

##### Usage
Provides players with a real-time update of the game's progress, phase duration, and their role, enhancing the interactive experience of the game.

#### PlayerList Component

##### Overview
`PlayerList` displays the list of players registered in the game, updating in response to game events like player deaths and phase changes.

##### Key Features
- **Dynamic Player List**: Fetches and displays the list of registered players, updating as the game progresses.
- **Player Death Notification**: Shows notifications when players die and removes them from the list.
- **Automatic Voting**: In specific phases, performs automatic actions like voting if the player's role warrants it.

##### Technical and Logical Breakdown
- **State Management**: Uses `useState` to track the list of players, death notifications, and visibility flags.
- **Contract Interaction**: Communicates with the smart contract to fetch player data and handle game logic like voting.
- **Effect Hooks**:
  - `useEffect` for updating the player list based on contract changes.
  - Handles automatic actions based on the current game phase and player role.
- **Player Card Rendering**: Maps over the `players` array to render `PlayerCard` components for each player.
- **Navigation**: Utilizes `useNavigate` for redirecting to different game states based on game outcomes (e.g., villagers win, wolves win).

##### Usage
Serves as a central component for displaying game participants and handling dynamic updates during the game.

#### PlayerCard Component

##### Overview
`PlayerCard` represents an individual player in the game, allowing players to interact with each other during specific game phases.

##### Key Features
- **Player Interaction**: Enables voting during 'village_vote' and 'wolves_vote' phases.
- **Contract Interaction**: Communicates with the smart contract for voting actions.

##### Functionality
- **Handling Votes**:
  - Implements `handleDailyDebateVote` and `handleWolvesNightVote` for player voting based on the game phase.
  - Utilizes the contract to send vote transactions and handles errors.
- **User Interface**:
  - Renders player information (like address).
  - Clickable interface triggering voting functions based on the current game phase.

##### Usage
Serves as an interactive element within the game, allowing players to vote during key phases. It integrates with blockchain operations and provides a user-friendly way to participate in game decisions.

#### ChatBox Component

##### Overview
`ChatBox` facilitates in-game communication among players, providing a real-time chat interface.

##### Key Features
- **Real-time Messaging**: Allows players to send and receive messages.
- **Message Fetching**: Periodically fetches new messages from a specified API.

##### Functionality
- **Message State Management**: Uses `useState` to track messages and the new message input.
- **Fetching Messages**: Implements `fetchMessages` to periodically retrieve messages from the server.
- **Message Sending**:
  - Manages input for new messages and sends them using `sendMessageUtil`.
  - Clears the input field after sending a message.

##### Usage
Serves as a communication tool within the game, enhancing player interaction and strategic discussion.

#### sendMessageUtil Function

##### Overview
`sendMessageUtil` is a utility function for sending chat messages in the Werewolf game, interacting with the backend API.

##### Functionality
- **API Communication**: Sends a POST request to the `${api}/send_message` endpoint.
- **Data Handling**: Includes `chatId`, `playerAddress`, and `messageText` in the request body.

##### Error Handling
- Checks the HTTP response status and throws an error for non-success responses.
- Logs a success message upon a successful send or an error message on failure.

##### Usage
This utility function is integral for the chat feature, enabling players to send messages to each other during the game.

#### GameOver Component

##### Overview
`GameOver` is a simple component displayed when a player is eliminated from the game, showing a game over message.

##### Key Features
- **Navigation**: Utilizes `useNavigate` from React Router for navigation back to the home page.
- **User Interface**:
  - Displays a message indicating that the player has been eliminated.
  - Provides a button for players to navigate back to the home screen.

##### Usage
Serves as an end-of-game screen for eliminated players, providing a clear message and an option to return to the main menu of the game.

#### VillagersWin Component

##### Overview
`VillagersWin` displays a victory message for the villagers at the end of the game, tailored to the player's role.

##### Key Features
- **Dynamic Message Display**: Changes the message based on whether the player is a wolf or a villager.
- **Role-Based Styling**: Applies different CSS classes based on the player's role to reflect winning or losing status.

##### Usage
Serves as a conclusion screen for the game, providing feedback on the game outcome with a message indicating the villagers' victory.

#### WolvesWin Component

##### Overview
`WolvesWin` is a component that displays a victory message for the wolves at the game's conclusion, depending on the player's role.

##### Key Features
- **Dynamic End-Game Message**: Adjusts the displayed message based on whether the player was part of the winning wolves team or not.
- **Styling Based on Outcome**: Applies different CSS classes to reflect whether the player won or lost.

##### Usage
Acts as an end-game screen, providing players with a message that celebrates the wolves' victory or acknowledges their defeat, enhancing the game's conclusion experience.

### CSS and Image Assets

#### Overview
Our project employs a combination of Bulma CSS and custom CSS to craft a visually appealing and responsive design.

#### Styling Approach
- **Bulma CSS**: Utilized for its modern, easy-to-use components that enhance UI development.
- **Custom CSS**: Further tailored to meet specific design needs, ensuring a unique and engaging user experience.

#### Image Assets
- All images in the project are AI-generated, adding a unique and innovative visual aspect to the game. This approach ensures originality and aligns with the futuristic theme of employing advanced technologies in the game's development.

#### Usage
The blend of Bulma CSS and custom styles, along with AI-generated imagery, contributes significantly to the aesthetic appeal and user-friendly interface of the Werewolf game.

## Conclusion

This comprehensive documentation has outlined the intricacies of the Werewolf Game's frontend, showcasing the synergy between React components and Ethereum blockchain technology. Each component, from the dynamic `PlayerList` and interactive `ChatBox` to the context-managing `ContractProvider` and game-concluding `WolvesWin` and `VillagersWin` screens, plays a pivotal role in delivering an immersive gaming experience. The frontend architecture demonstrates a seamless blend of user-friendly design and advanced blockchain interactions, ensuring engaging gameplay and secure, decentralized operations. For further details and insights, we encourage diving into the source code, where each component's functionality and role within the game's ecosystem are elaborated.
