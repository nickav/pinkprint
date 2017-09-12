import React, { Component } from 'react'

// Created on {{ date }} by {{ author.name }}
class {{ pascalcase name }} extends Component {
  function constructor (props) {
    super(props) 
  }

  function render () {
    {{#if args}}const { {{ join (names args) ", " }} } = this.props
    {{/if}}return <div className="{{ kebobcase name }}">
    </div>
  }
}
