import React from 'react';
import NODE_TYPES from './Node';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
const activeClassName = 'active';

class Cloud extends React.Component {
  onChange() {

  }

  render() {
    const { annuitCœptis, authorMode, node } = this.props;
    const children = (node.children || []).filter(
      node =>
        node.type === NODE_TYPES.NODE_TYPE_NODE
    );

    return (
      <Tabs>
        <TabList>
          <Tab>Default</Tab>
          <Tab>+</Tab>
        </TabList>

        <TabPanel>
          <Typeahead
            id="nope"
            multiple={ authorMode }
            emptyLabel={ false }
            onKeyDown={ e => {
              if ( !authorMode && e.keyCode === 13 ) {
                console.log('keyDown && submit ', e.keyCode);
                this.submitForm();
              }
            } }
            labelKey="text"
            ref={(typeahead) => this.typeahead = typeahead}
            options={ children.map( node => node.text ) }
            onInputChange={ this.onChange.bind(this) }
            onChange={ this.onChange.bind(this) }
          />
        </TabPanel>
      </Tabs>
    );
  }
};

export default Cloud;
