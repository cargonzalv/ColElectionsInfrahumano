import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {MenuItem, Paper, TextField, withStyles} from 'material-ui';
import { Search } from "@material-ui/icons";
import { NavLink } from "react-router-dom";

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSectionSuggestions(section) {
  return section.usersPlaces;
}
function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);
  let toRender = suggestion.userPlace.uid ? (<NavLink
            to={"user/" + suggestion.userPlace.uid}
            activeClassName="active"
          >
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          console.log(part)
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
    </NavLink>):
  suggestion.userPlace.id ? (<NavLink
            to={"place/" + suggestion.userPlace.id}
            activeClassName="active"
          >
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          console.log(part)
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
    </NavLink>):
    <div selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          );
        })}
      </div>
    </div>
  return (toRender);
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}


let inputStyle = {
   color:"#FFFFFF",
    '&::placeholder': {
      textOverflow: 'ellipsis !important',
      color: 'white',
      opacity:0.8,
    }
}
const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'absolute',
    top:20,
    left:"calc(80% - 100px)",
    height: 50,
    zIndex:1000,
    color:"#00000"
  },
   child: {
    display:'inline-block',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0

  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  input:inputStyle
});

class IntegrationAutosuggest extends React.Component {
  state = {
    value: '',
    suggestions: this.props.suggestions,
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };


getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  let sug = this.props.suggestions
    .map(section => {
      return {
        title: section.title,
        usersPlaces: section.usersPlaces.filter(userPlace => regex.test(userPlace.name))
      };
    })
    .filter(section => section.usersPlaces.length > 0);
     return sug.length > 0 ? sug: [{
      title: 'Not found',
      usersPlaces: [{name:"couldn't find any match",userPlace:{}}]
      }]
  }

  render() {
    const { classes } = this.props;

    return (
      <div className = {classes.container}>
      <Autosuggest
        theme={{
          container: classes.child,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        multiSection={true}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={{
          classes,
          placeholder: 'Search User / Restaurant',
          value: this.state.value,
          onChange: this.handleChange,
          color:"#FFFFFF"
        }}
      />

          <Search className={classes.searchIcon} />
      </div>
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);