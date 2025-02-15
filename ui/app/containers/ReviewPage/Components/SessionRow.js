import {
  TableCell,
  Typography,
  Slide,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import es from 'javascript-time-ago/locale/es';
import pt from 'javascript-time-ago/locale/pt';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import React, { Fragment } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import {
  PlayImageCell,
} from '../../../components/StyledTable';
import messages from '../messages';
import CodeModal from '../../../components/CodeModal';

TimeAgo.addLocale(en);
TimeAgo.addLocale(es);
TimeAgo.addLocale(pt);

const styles = {
  userSays: {
    paddingRight: '5px',
    lineHeight: '1.5',
  },
  addActionIcon: {
    height: '15px',
    '&:hover': {
      filter: 'invert(1)',
    },
    cursor: 'pointer',
    verticalAlign: 'middle',
  },
  actionBackgroundContainer: {
    '&:hover': {
      backgroundColor: '#4e4e4e',
      color: '#fff',
    },
    margin: '0px 5px 0px 5px',
    fontSize: '12px',
    padding: '4px 8px 4px 8px',
    backgroundColor: '#e2e5e7',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    marginTop: '2px',
  },
  actionLabel: {
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
    bottom: '1px',
  },
  deleteActionX: {
    '&:hover': {
      fontWeight: 'bold',
    },
    paddingLeft: '5px',
    fontWeight: 300,
    cursor: 'pointer',
  },
  categoryBackgroundContainer: {
    margin: '0px 5px 0px 0px',
    fontSize: '12px',
    padding: '4px 8px 4px 10px',
    backgroundColor: '#f6f7f8',
    display: 'inline-block',
    position: 'relative',
    borderRadius: '5px',
    marginTop: '2px',
  },
  categoryLabel: {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '12px',
  },
  categorySelectContainer: {
    margin: '0px',
  },
  categorySelectInputContainer: {
    margin: '0px !important',
  },
  categorySelect: {
    padding: '5px',
    backgroundColor: '#f6f7f8',
    border: 'none',
    fontSize: '12px',
    textAlign: 'center',
  },
  rowCategory: {
    color: 'red',
  },
  dialog: {
    border: '1px solid #4e4e4e',
  },
  dialogContent: {
    backgroundColor: '#f6f7f8',
    borderBottom: '1px solid #4e4e4e',
  },
  dialogCopy: {
    height: '105px',
    overflowX: 'hidden',
  },
  dialogContentGrid: {
    margin: '40px 0px',
  },
  exitButton: {
    color: '#00bd6f',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  messageSource: {
    '&:hover': {
      textDecoration: 'underline',
    },
    cursor: 'pointer',
    fontSize: '10px',
    marginTop: '10px',
  },
};

/* eslint-disable react/prefer-stateless-function */
class SessionRow extends React.Component {

  state = {
    openCategoryModal: false,
    selectedCategory: '-1',
    categoryError: false,
    openCodeModal: false,
  };

  getDocTime(timestamp) {
    try {
      if (timestamp) {
        const timeAgo = new TimeAgo(this.props.locale).format(
          new Date(parseInt(timestamp)),
          'twitter',
        );
        return timeAgo || '< 1m';
      }
      return '';
    }
    catch(e) {
      console.log(e);
    }
  }

  render() {
    const {
      classes,
      session,
      intl,
    } = this.props;

    return (
      <Fragment>
        <TableCell>
          <Typography
            variant="body1"
            style={{ fontSize: '10px', color: '#4e4e4e' }}
          >
            {this.getDocTime(session.modificationDate)}
          </Typography>
        </TableCell>
        <TableCell>
          <span className={classes.userSays}>
            {session.sessionId}
          </span>
          {session.id !== 'noData' ? 
            [<span key='seeSourceLabel'
              onClick={() => {
                this.setState({ openCodeModal: true });
              }}
              className={classes.messageSource}
            >
              {'</> '}
              <span>{intl.formatMessage(messages.seeSource)}</span>
            </span>,
            <CodeModal key='codeModal'
              handleClose={() => {
                this.setState({ openCodeModal: false });
              }}
              CSO={
                session.converseResult
                  ? session.converseResult.CSO
                  : null
              }
              open={this.state.openCodeModal}
            />]
          : null
          }
        </TableCell>
        <PlayImageCell
          tooltip={intl.formatMessage(messages.reproduceSession)}
          disabled={session.id === 'noData'}
          onClick={() => {
            this.props.onToggleConversationBar(true);

            let sessions = sessionStorage.getItem('sessions');

            if (!sessions){
              sessions = '{}';
            }
            sessions = JSON.parse(sessions);

            if (!sessions[this.props.agent.agentName] || sessions[this.props.agent.agentName].sessions.length === 0) {
              sessions[this.props.agent.agentName] = {
                sessionId: '',
                sessions: [],
              };
            }

            sessions[this.props.agent.agentName].sessionId = session.sessionId;
            if(sessions[this.props.agent.agentName].sessions.indexOf(session.sessionId) === -1){
              sessions[this.props.agent.agentName].sessions.unshift(
                session.sessionId,
              );
            }
            sessionStorage.setItem(
              'sessions',
              JSON.stringify(sessions),
            );
            this.props.onLoadSessionId(session.sessionId);
          }}
        />
      </Fragment>
    );
  }
}

SessionRow.propTypes = {
  intl: intlShape,
  agent: PropTypes.object,
  classes: PropTypes.object,
  session: PropTypes.object,
  onToggleConversationBar: PropTypes.func,
  onSendMessage: PropTypes.func,
  onCopySaying: PropTypes.func,
  locale: PropTypes.string,
  onLoadSessionId: PropTypes.func,
};

export default injectIntl(withStyles(styles)(SessionRow));
