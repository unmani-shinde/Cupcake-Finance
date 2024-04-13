import { useState } from 'react';
import { Checkbox, Table, TextInput } from 'flowbite-react';

function SelectTokens() {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [individualCheckboxStates, setIndividualCheckboxStates] = useState({
    apt: false,
    udst: false,
    btc: false,
  });
  const [ratioInputsEnabled, setRatioInputsEnabled] = useState({
    apt: false,
    udst: false,
    btc: false,
  });
  const [ratios, setRatios] = useState({
    apt: '',
    udst: '',
    btc: '',
  });

  // Function to handle header checkbox click
  const handleHeaderCheckboxClick = () => {
    setSelectAllChecked(prev => !prev);
    setIndividualCheckboxStates(prev => {
      return Object.keys(prev).reduce((acc, key) => {
        acc[key] = !prev[key];
        return acc;
      }, {});
    });
    setRatioInputsEnabled(prev => {
      return Object.keys(prev).reduce((acc, key) => {
        acc[key] = !prev[key];
        return acc;
      }, {});
    });
  };

  // Function to handle individual checkbox click
  const handleIndividualCheckboxClick = (token) => {
    setIndividualCheckboxStates(prev => {
      const updatedState = { ...prev, [token]: !prev[token] };
      const allChecked = Object.values(updatedState).every(value => value === true);
      setSelectAllChecked(allChecked);
      return updatedState;
    });
    setRatioInputsEnabled(prev => ({
      ...prev,
      [token]: !prev[token],
    }));
  };

  // Function to handle ratio input change
  const handleRatioInputChange = (event, token) => {
    const { value } = event.target;
    setRatios(prev => ({
      ...prev,
      [token]: value,
    }));

    // Automatically autofill values for other tokens
    
  };

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox checked={selectAllChecked} onChange={handleHeaderCheckboxClick} />
          </Table.HeadCell>
          <Table.HeadCell>Available Token</Table.HeadCell>
          <Table.HeadCell>Ratio</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox
                checked={individualCheckboxStates.apt}
                onChange={() => handleIndividualCheckboxClick('apt')}
              />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'Aptos Coin (APT)'}
            </Table.Cell>
            <Table.Cell>
              {ratioInputsEnabled.apt && (
                <TextInput
                  placeholder="Value"
                  value={ratios.apt}
                  onChange={(event) => handleRatioInputChange(event, 'apt')}
                />
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox
                checked={individualCheckboxStates.udst}
                onChange={() => handleIndividualCheckboxClick('udst')}
              />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Tether (UDST)
            </Table.Cell>
            <Table.Cell>
              {ratioInputsEnabled.udst && (
                <TextInput
                  placeholder="Value"
                  value={ratios.udst}
                  onChange={(event) => handleRatioInputChange(event, 'udst')}
                />
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox
                checked={individualCheckboxStates.btc}
                onChange={() => handleIndividualCheckboxClick('btc')}
              />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">Bitcoin (BTC)</Table.Cell>
            <Table.Cell>
              {ratioInputsEnabled.btc && (
                <TextInput
                  placeholder="Value"
                  value={ratios.btc}
                  onChange={(event) => handleRatioInputChange(event, 'btc')}
                />
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default SelectTokens;
