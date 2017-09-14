/******************************************************************************\
* File: <%= name %>.jsx
*
* Author: <%= author.name %>
*
* Description: <%= argv.description %>
*
* Notes: <%= argv.notes %>
\******************************************************************************/

//------------------------------------------------------------------------------
// Node Modules ----------------------------------------------------------------
import React from 'react';
import classNames from 'classnames';
<% if (argv.style !== false) { -%>
//------------------------------------------------------------------------------
// Style -----------------------------------------------------------------------
import style from '@/style/common/icons/Icon.scss';
<% } -%>
//------------------------------------------------------------------------------
// React Class -----------------------------------------------------------------
class <%= name %> extends React.Component {
    render() {
        const { className, onClick } = this.props;

        const cn = classNames(style.Icon, {
            [style['clickable']]: onClick,
            [className]: className
        });

        return (
            <svg className={cn} viewBox="<%= viewbox %>" onClick={onClick}>
                <%- svg %>
            </svg>
        );
    }
}
export default <%= name %>;