// Auto-generated via `yarn g store`
import { combineReducers } from 'react-redux';
<% files.forEach(file => { -%>
import <%= file %> from './<%= file %>';
<% }) -%>

export default combineReducers({
<% files.forEach(file => { -%>
  <%= file %>,
<% }) -%>
});
