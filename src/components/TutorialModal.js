import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Header, Modal } from 'semantic-ui-react';

const TutorialModal = ({
  tutorialData,
  setTutorialData,
  selectedDialogs,
  setSelectedDialogs,
  generatedSection,
  setGeneratedSection,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedDialogs.length === 0) {
      setGeneratedSection({});
    } else {
      const name = selectedDialogs[0];
      setGeneratedSection({
        Name: name,
        Activated: false,
        Initializer: `tutorial:show-dialog ${selectedDialogs[0]} false`,
        Finalizer: selectedDialogs
          .map((dialog) => {
            return `tutorial:hide-dialog ${dialog}`;
          })
          .join('\n'),
      });
    }
  }, [selectedDialogs]);

  const closeModel = () => {
    setOpen(false);
    setSelectedDialogs([]);
    setGeneratedSection({});
  };

  const onChangeDialogCheckbox = (event, data) => {
    const { dialogName } = data;
    if (data.checked === false) {
      setSelectedDialogs(
        selectedDialogs.filter((value) => {
          return value !== dialogName;
        }),
      );
    } else {
      setSelectedDialogs(selectedDialogs.concat(dialogName));
    }
  };

  const generateSection = () => {
    setOpen(false);

    if (!generatedSection.Name) {
      return;
    }

    const tutorialDataCopy = JSON.parse(JSON.stringify(tutorialData));
    let name = generatedSection.Name;
    const existedNames = tutorialData.Sections.map((section) => section.Name);
    if (existedNames.includes(name)) {
      let copyVersion = 1;
      while (existedNames.includes(`${name}-${copyVersion}`)) {
        copyVersion += 1;
      }
      name = `${name}-${copyVersion}`;
    }
    const generatedSectionCopy = JSON.parse(JSON.stringify(generatedSection));
    generatedSectionCopy.Name = name;
    if (tutorialDataCopy.Sections) {
      tutorialDataCopy.Sections = tutorialData.Sections.concat(
        generatedSectionCopy,
      );
      setTutorialData(tutorialDataCopy);
    } else {
      tutorialDataCopy.Sections = [generatedSectionCopy];
    }
    setTutorialData(tutorialDataCopy);
    setSelectedDialogs([]);
    setTimeout(() => {
      const id = `root_Sections_${tutorialData.Sections.length}_Name`;
      const $anchor = document.getElementById(id);
      const offsetTop =
        $anchor.getBoundingClientRect().top + window.pageYOffset;
      window.scroll({
        top: offsetTop,
        behavior: 'smooth',
      });
    }, 0);
  };

  return (
    <Modal
      onClose={closeModel}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button fluid style={{ marginTop: '16px' }}>
          Add dialog-related Section
        </Button>
      }
    >
      <Modal.Header>Generate Dialog-related Section</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Header>Dialog List</Header>
          {tutorialData.Dialogs
            ? tutorialData.Dialogs.map((dialog) => {
                return (
                  <Checkbox
                    onChange={onChangeDialogCheckbox}
                    label={`${dialog.Name}`}
                    dialogName={`${dialog.Name}`}
                    style={{ display: 'block', marginBottom: '10px' }}
                  />
                );
              })
            : null}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={closeModel}>
          Cancel
        </Button>
        <Button
          content="Generate Section"
          labelPosition="right"
          icon="checkmark"
          onClick={generateSection}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default TutorialModal;
