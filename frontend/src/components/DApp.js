import React from 'react';
import {useWeb3React} from "@web3-react/core";
import Registation from './Quotation';
import Initiatives from './Policies';
import StatusBar from './StatusBar';
import Instruction from './Instruction';
import Contribution from './Contribution';

// controls main window of the application based on current phase
// and active state
export default function DApp(props) {

    return (
        <div className="App-Center App-Contribution m-5 bg-light" id="dApp"> 
            <h2 className="fw-bold">{`Current phase: ${props.state.phase}`}</h2>
            {!active ? <p className='m-4'>Connect wallet to perform the actions.</p> : 
             props.state.phase !== 'registration' ? <StatusBar state={props.state} /> : ''
            }
            {props.state.phase === 'fundraising' ? 
                <div className="w-25 p-4 m-4 border border-1" style={{"borderRadius": "0.25rem", "borderColor": "rgba(0,0,0,.125)"}}>
                    <Instruction />
                    <Contribution contract={props.contract} />
                </div> : ''
            }
            {props.state.phase === 'registration' ? 
                <Registation contract={props.contract} /> : 
                <Initiatives contract={props.contract} state={props.state} initiatives={props.initiatives} />
            }
        </div>
    )
}
