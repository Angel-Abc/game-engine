type GameProps = Record<string, never>

const Game: React.FC<GameProps> = (): React.JSX.Element => {
    return (
        <div>Welcome to the game!</div>
    )
}

export default Game
