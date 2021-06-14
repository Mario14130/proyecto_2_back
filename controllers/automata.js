class AutomataController {

    transform() {
        return (req, res, next) => {
            const AFND = req.body;
            const AFD = this.getAFD(AFND, [AFND.initialState]);

            res.send(AFD);
        }
    };

    getAFD = (AFND) => {

        const { alphabet, initialState } = AFND;

        const AFDStates = this.buildStates(AFND);

        const AFDTransitions = this.buildTransitions(AFND, AFDStates);

        const AFDacceptanceStates = this.buildAcceptanceStates(AFND, AFDStates);

        const AFD = {
            alphabet,
            states: AFDStates,
            transitions: AFDTransitions,
            initialState,
            acceptanceStates: AFDacceptanceStates
        }

        return AFD;
    }

    buildStates = (AFND, AFDStates = [], counter = 0) => {
        const { alphabet, states, transitions, initialState } = AFND;

        AFDStates = [...AFDStates];

        if (counter === 0) {
            AFDStates = [initialState];
        }

        if (counter !== AFDStates.length) {
            const state = AFDStates[counter];
            const statesSeparated = this.separateStates(states, state);
            const newStates = this.buildNewStates(alphabet);
            statesSeparated.forEach((state) => {
                const position = states.indexOf(state);
                const transition = transitions[position];
                for (const key in transition) {
                    const transitingTo = transition[key];
                    newStates[key] = [...newStates[key], transitingTo];
                }
            })

            for (const key in newStates) {
                newStates[key] = newStates[key].filter((newState, index, self) => index === self.indexOf(newState));
                const newState = newStates[key];
                if (!AFDStates.find((state) => state === newState.join(''))) {
                    AFDStates.push(newState.join(''));
                }
            }

            return this.buildStates(AFND, AFDStates, counter + 1);
        }

        return AFDStates;
    };

    buildTransitions = (AFND, AFDStates) => {
        // TODO: Crear funcion
        const { alphabet, states, transitions } = AFND;
        const AFDTransitions = [];

        for (let i = 0; i < AFDStates.length; i++) {
            const AFDState = AFDStates[i];
            const statesSeparated = this.separateStates(states, AFDState);
            const newTransitions = this.buildNewStates(alphabet);
            statesSeparated.forEach((state) => {
                const position = states.indexOf(state);
                const transition = transitions[position];
                for (const key in transition) {
                    const transitingTo = transition[key];  
                    newTransitions[key].push(transitingTo);
                    AFDTransitions[i] = { ...AFDTransitions[i], [key]: newTransitions[key].join('') };
                }
            });

        }

        return AFDTransitions;

    };

    buildAcceptanceStates = (AFND, AFDStates) => {
        // TODO: Crear funcion
        const { acceptanceStates } = AFND;
        const acceptanceStatesCleaned = acceptanceStates.filter((state) => state);
        
        const AFDAcceptanceStates = AFDStates.filter((states) => {
            for (let i = 0; i < acceptanceStatesCleaned.length; i++) {
                const acceptanceState = acceptanceStatesCleaned[i];
                return states.includes(acceptanceState);
            }
        });

        return AFDAcceptanceStates;

    };

    buildNewStates = (alphabet) => {
        const newStates = {};
        alphabet.forEach((alpha) => {
            newStates[alpha] = [];
        })
        return newStates;
    }

    separateStates(individualStates, state) {
        return individualStates.filter((individualState) => state.includes(individualState)); 
    }
    
}

const automataController = new AutomataController();

module.exports = { automataController };

// {
//     "alphabet": [
//         "0",
//         "1"
//     ],
//     "states": [
//         "p",
//         "q",
//         "r",
//         "s",
//         "t"
//     ],
//     "transitions": [
//         {
//             "0": "p",
//             "1": "pq"
//         },
//         {
//             "0": "r",
//             "1": "r"
//         },
//         {
//             "0": "s"
//         },
//         {
//             "0": "t"
//         }
//     ],
//     "initialState": "p",
//     "acceptanceStates": [
//         null,
//         null,
//         null,
//         null,
//         "t"
//     ]
// }