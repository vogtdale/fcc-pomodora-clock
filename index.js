function App() {
    const [displayTime, setDisplayTime] = React.useState(25*60);;
    const [breakTime, setBreakTime] = React.useState(5*60);
    const [sessionTime, setSessionTime] = React.useState(25*60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio("./breakTime.mp3"));

    // format the time
    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let secondes = time % 60;
        return (
            (minutes < 10 ? "0" + minutes : minutes) +  // if minutes are less than 10 then we want 0 + our minutes otherwise(:) just our minutes + add a cologn(:)
            ":" +
            (secondes < 10 ? "0" + secondes : secondes)
        );

    };

    const changeTime = (amount, type) => {
        if (type == "break") {
            if (breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime((prev) => prev + amount)
        }
        else {
            if (sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime((prev) => prev + amount)
            // check if timer is on or if the timer is not on set our displaytime to be = sessionTime + our amount n to 
            if (!timerOn) {
                setDisplayTime(sessionTime + amount)
            }
        }
    };

    //start the timer
    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        console.log(date)
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if (prev <= 0 && !onBreakVariable) {
                            playBeepSound();
                            onBreakVariable=true;
                            setOnBreak(true);
                            return breakTime;

                        }else if (prev <=0 && onBreakVariable) {
                            playBeepSound();
                            onBreakVariable=false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev - 1;
                    });
                    nextDate += second;
                }
            },30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval);
        }
        //stop timer
        if (timerOn) {
            clearInterval(localStorage.getItem("interval-id"));
        }
        setTimerOn(!timerOn)

    };

    const reset = () => {
        setDisplayTime(25*60);
        setBreakTime(5*60);
        setSessionTime(25*60);

    };

    const playBeepSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();

    }

    return(
        <div className="center-align">
            <h1>Pomodora Clock</h1>
            <div className="dual-container">
                {/* break Length */}
                <Length
                    title={"break Length"}
                    changeTime={changeTime}
                    type={"break"} 
                    time={breakTime} 
                    formatTime={formatTime}
                    id="break-label break-length"

                />

                {/* Session length */}
                <Length
                    title={"session Length"}
                    changeTime={changeTime}
                    type={"session"} 
                    time={sessionTime} 
                    formatTime={formatTime}
                    id="break-label break-length"
                />
            </div>

            <h3 id="time-left">{onBreak ? "Break" : "Session"}</h3>
            <h1 id="timer-label">{formatTime(displayTime)}</h1>
            <button className="btn-large deep-purple lighten-2" onClick={controlTime}>
                {timerOn ? ( //if the timer is on do
                    <i id="start_stop" className="material-icons">pause_circle_filled</i>
                ): (
                    <i className="material-icons">play_circle_filled</i>
                )}
            </button>

            <button className="btn-large deep-purple lighten-2" onClick={reset}>
                <i  id="reset" className="material-icons">autorenew</i>
            </button>
        </div>
    );
};

function Length({title, changeTime, type, time, formatTime}) {
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
            {/* downward arrow */}
                <button 
                    className="btn-small deep-purple lighten-2"
                    onClick={() =>changeTime(-60, type)}
                    id="break-decrement session-decrement"
                >
                    <i className="material-icons">arrow_downward</i>
                </button>
            {/* adding the time (5) */}
                <h3>{formatTime(time)}</h3>
            {/* uppward arrow */}
                <button 
                    className="btn-small deep-purple lighten-2"
                    onClick={() =>changeTime(+60, type)}
                    id="break-increment session-increment"
                >
                    <i className="material-icons">arrow_upward</i>
                </button>

            </div>
        </div>
    );

};

ReactDOM.render(<App/>, document.getElementById('root'))