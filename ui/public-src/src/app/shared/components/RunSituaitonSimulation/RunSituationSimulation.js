import React, { useEffect, useState } from 'react';
import ReactFlow, { snapGrid } from 'react-flow-renderer';
import _ from 'lodash';
import ConfigureSituationFlow from '../ConfigureSituationFlow/ConfigureSituationFlow';
import Button from '@material-ui/core/Button';

export default function RunSituationSimulation(props) {
  const [elements, setElements] = useState(false);
  const [openConfigurationPanel, setOpenConfigurationPanel] = useState(false);
  const [selectedNode, setSelectedNode] = useState();
  const [situationList, setSituationList] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const closeConfigurationPanel = (saved) => {
    console.log(saved);
    if (saved) {
      setRunning(false);
      setCompleted(false);
    }
    setOpenConfigurationPanel(false);
  };

  const handleNodeClick = (e, node) => {
    setSelectedNode(node);
    setOpenConfigurationPanel(true);
  };

  const getSituaitonName = (situaitonId) => {
    return situationList.find((s) => s._id === situaitonId).situation_name;
  };

  const getBorderStyle = (status) => {
    if (status == 'active') {
      return '3px solid #f3ca20';
    }
    if (status == 'completed') {
      return '3px solid #a8c66c';
    }
    if (status == 'failed') {
      return '3px solid #b20238';
    }
  };

  const modifyElement = (situationId, status) => {
    const newElementlist = _.cloneDeep(elements);
    // console.log(newElementlist, situationId, status);
    newElementlist.find((elem) => elem.situationId == situationId).style = {
      border: getBorderStyle(status),
      padding: 10,
    };

    setElements(newElementlist);
  };

  const writeIntoConsole = (message, id, name) => {
    props.store.sessionsStore.addLogs({
      message: message,
      situationId: id,
      situationName: name,
      timestamp: new Date(),
      type: 'session_payload',
    });
  };

  const runSimulation = () => {
    writeIntoConsole('Running Simulation...', 1, '');
    writeIntoConsole('Loading transitions configuraiton....', 1, '');
    props.transitions.map((transition, index) => {
      const timer = setTimeout(
        () => {
          writeIntoConsole(
            'Running situation: ' + getSituaitonName(transition.from),
            transition.from,
            getSituaitonName(transition.from)
          );
          modifyElement(transition.from, 'active');
          writeIntoConsole(
            'Time based:' + transition.time + ' seconds.',
            transition.from,
            getSituaitonName(transition.from)
          );
        },
        1500,
        () => clearTimeout(timer)
      );
      const timeInterval = setTimeout(
        () => {
          writeIntoConsole(
            'Transition to situation:' + getSituaitonName(transition.to),
            transition.to,
            getSituaitonName(transition.to)
          );
          modifyElement(transition.from, 'completed');
          const timer = setTimeout(
            () => {
              writeIntoConsole(
                'Situation Completed:' + getSituaitonName(transition.to),
                transition.to,
                getSituaitonName(transition.to)
              );
              modifyElement(transition.to, 'completed');
              if (props.transitions.length == index + 1) {
                setRunning(false);
                setCompleted(true);
              }
            },
            1500,
            () => clearTimeout(timer)
          );
        },
        transition.timeBased ? transition.time * 1000 : 3000
      );
      return () => clearTimeout(timeInterval);
    });
  };

  const generateElements = () => {
    const newSituaitonList = _.cloneDeep(props.situationList).map(
      (situation, index) => {
        return {
          id: index + '',
          data: {
            label: situation.situation_name,
            situation: situation,
            color: '#1A192B',
          },
          position: { x: 300, y: (index + 1) * 100 },
          situationId: situation._id,
          style: { border: '2px solid #000', padding: 10 },
        };
      }
    );

    if (props.transitions) {
      const transitionConnectors = props.transitions.map(
        (transition, index) => {
          // return transition;
          const connector = {
            id: transition.from + '_' + transition.to,
            source: newSituaitonList.find(
              (s) => s.situationId == transition.from
            ).id,
            target: newSituaitonList.find((s) => s.situationId == transition.to)
              .id,
            arrowHeadType: 'arrowclosed',
          };
          newSituaitonList.push(connector);
        }
      );
      setConnectors(transitionConnectors);
    }
    setElements(newSituaitonList);
  };

  useEffect(() => {
    if (props.situationList && props.situationList.length) {
      generateElements();
      setSituationList(props.situationList);
    }
  }, [props]);

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {props.transitions &&
        props.transitions.length > 0 &&
        !running &&
        !completed ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setRunning(true);
              runSimulation();
            }}
          >
            Start simulation
          </Button>
        ) : running ? (
          'Simulation running ...'
        ) : completed ? (
          'Simulaiton completed.'
        ) : (
          ''
        )}
      </div>
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ display: 'flex', marginRight: '20px' }}>
          <div
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: '#f3ca20',
              marginRight: '5px',
              borderRadius: '50%',
            }}
          ></div>
          <div>Active</div>
        </div>
        <div style={{ display: 'flex', marginRight: '20px' }}>
          <div
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: '#a8c66c',
              marginRight: '5px',
              borderRadius: '50%',
            }}
          ></div>
          <div>Completed</div>
        </div>
        <div style={{ display: 'flex', marginRight: '20px' }}>
          <div
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: '#b20238',
              marginRight: '5px',
              borderRadius: '50%',
            }}
          ></div>
          <div>Failed</div>
        </div>
      </div>
      <div style={{ height: '80vh' }}>
        {elements && elements.length > 0 ? (
          <ReactFlow
            elements={elements}
            onNodeDoubleClick={(e, node) => handleNodeClick(e, node)}
            snapToGrid={true}
            snapGrid={snapGrid}
          />
        ) : (
          <div>No Situaitons</div>
        )}
        {openConfigurationPanel && (
          <ConfigureSituationFlow
            selectedNode={selectedNode}
            situationList={situationList}
            openConfigurationPanel={openConfigurationPanel}
            closeConfigurationPanel={closeConfigurationPanel}
            elementList={elements}
          ></ConfigureSituationFlow>
        )}
      </div>
    </React.Fragment>
  );
}
