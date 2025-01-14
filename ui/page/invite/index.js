import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import {
  selectUserInviteStatusFailed,
  selectUserInviteStatusIsPending,
  selectUserVerifiedEmail,
} from 'redux/selectors/user';
// import { doFetchInviteStatus } from 'redux/actions/user';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import InvitePage from './view';

const select = (state) => ({
  isFailed: selectUserInviteStatusFailed(state),
  isPending: selectUserInviteStatusIsPending(state),
  inviteAcknowledged: makeSelectClientSetting(SETTINGS.INVITE_ACKNOWLEDGED)(state),
  authenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch) => ({
  // fetchInviteStatus: () => dispatch(doFetchInviteStatus()),
  acknowledgeInivte: () => dispatch(doSetClientSetting(SETTINGS.INVITE_ACKNOWLEDGED, true)),
});

export default connect(select, perform)(InvitePage);
