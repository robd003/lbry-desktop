// @flow
import React from 'react';
import classnames from 'classnames';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import CommentCreate from 'component/commentCreate';
import Button from 'component/button';
import MarkdownPreview from 'component/common/markdown-preview';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  activeViewers: number,
  embed?: boolean,
  doCommentSocketConnect: (string) => void,
  doCommentList: (string) => void,
  comments: Array<Comment>,
  fetchingComments: boolean,
};

export default function LivestreamFeed(props: Props) {
  const { claim, uri, embed, doCommentSocketConnect, comments, doCommentList, fetchingComments } = props;
  const commentsRef = React.createRef();
  const hasScrolledComments = React.useRef();
  const [performedInitialScroll, setPerformedInitialScroll] = React.useState(false);
  const claimId = claim && claim.claim_id;
  const commentsLength = comments && comments.length;

  React.useEffect(() => {
    if (claimId) {
      doCommentList(uri);
      doCommentSocketConnect(claimId);
    }
  }, [claimId, uri]);

  React.useEffect(() => {
    const element = commentsRef.current;

    function handleScroll() {
      if (element) {
        const scrollHeight = element.scrollHeight - element.offsetHeight;
        const isAtBottom = scrollHeight === element.scrollTop;

        if (!isAtBottom) {
          hasScrolledComments.current = true;
        } else {
          hasScrolledComments.current = false;
        }
      }
    }

    if (element) {
      element.addEventListener('scroll', handleScroll);

      if (commentsLength > 0) {
        // Only update comment scroll if the user hasn't scrolled up to view old comments
        // If they have, do nothing
        if (!hasScrolledComments.current || !performedInitialScroll) {
          element.scrollTop = element.scrollHeight - element.offsetHeight;

          if (!performedInitialScroll) {
            setPerformedInitialScroll(true);
          }
        }
      }
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [commentsRef, commentsLength, performedInitialScroll]);

  if (!claim) {
    return null;
  }

  return (
    <Card
      title={__('Live discussion')}
      smallTitle
      className="livestream__discussion"
      actions={
        <>
          {fetchingComments && (
            <div className="main--empty">
              <Spinner />
            </div>
          )}
          <div
            ref={commentsRef}
            className={classnames('livestream__comments-wrapper', {
              'livestream__comments-wrapper--with-height': commentsLength > 0,
            })}
          >
            {!fetchingComments && comments.length > 0 ? (
              <div className="livestream__comments">
                {comments.map((comment) => (
                  <div key={comment.comment_id} className={classnames('livestream__comment')}>
                    {comment.channel_url ? (
                      <Button
                        target="_blank"
                        className={classnames('livestream__comment-author', {
                          'livestream__comment-author--streamer': claim.signing_channel.claim_id === comment.channel_id,
                        })}
                        navigate={comment.channel_url}
                        label={comment.channel_name}
                      />
                    ) : (
                      <div className="livestream__comment-author">{comment.channel_name}</div>
                    )}
                    <MarkdownPreview content={comment.comment} simpleLinks />
                  </div>
                ))}
              </div>
            ) : (
              <div className="main--empty" />
            )}
          </div>

          <div className="livestream__comment-create">
            <CommentCreate livestream bottom embed={embed} uri={uri} />
          </div>
        </>
      }
    />
  );
}