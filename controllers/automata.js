class AutomataController {

    transform() {
        return (req, res, next) => {
            const AFND = req.body;
            console.log(req.body);
            console.log(AFND);
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
            const statesSeparated = state.split('');
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
            const statesSeparated = AFDState.split('');
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
}

const automataController = new AutomataController();

module.exports = { automataController };

// getAFD = async (AFND, currentStates, AFD = { states: [], transitions: [], acceptanceStates: [] }) => {

//     const { alphabet, states, transitions, initialState, acceptanceStates } = AFND;

//     AFD = {
//         alphabet,
//         states: [...AFD.states],
//         transitions: [...AFD.transitions],
//         initialState,
//         acceptanceStates: [...AFD.acceptanceStates]
//     }

//     console.log(currentStates, {states: AFD.states, transitions: AFD.transitions});

//     // if (this.counter < 5) {

//         AFD.states.push(currentStates.join(''));

//         const newStates = this.buildNewStates(alphabet);

//         const AFDposition = AFD.states.length - 1;
//         currentStates.forEach((state) => {

//             const individualStates = state.split('');

//             for (let i = 0; i < individualStates.length; i++) {

//                 const individualState = individualStates[i];

//                 const position = states.indexOf(individualState);
//                 const transition = transitions[position];

//                 for (const key in transition) {
//                     const transitingTo = transition[key];
//                     newStates[key] = [...newStates[key], transitingTo];
//                 }
//             }

//         });

//         let index = alphabet.length;

//         console.log(index);
//         for (const key in newStates) {
//             newStates[key] = newStates[key].filter((newState, index, self) => index === self.indexOf(newState));
//             const newState = newStates[key];
//             AFD.transitions[AFDposition] = { ...AFD.transitions[AFDposition], [key]: newState.join('') }
//             if (!AFD.states.find((state) => state === newState.join(''))) {
//                 this.counter += 1;
//                 if (index === 0) {
//                     return await this.getAFD(AFND, newState, AFD);
//                 } else {
//                     await this.getAFD(AFND, newState, AFD);
//                 }
//             }
//             index -= 1;
//         }

//     // }

//     return AFD;
// }
