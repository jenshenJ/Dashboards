import { FC, useState, useEffect } from 'react';
import { Card, Flex, Text, TextArea, Button } from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import useAuth from '@/ui/auth/useAuth';
import './CompanyComments.scss';

export type Comment = {
    id: string;
    text: string;
    author: string;
    isAdmin: boolean;
    date: string;
};

export type CompanyCommentsProps = {
    companyId: string;
    comments: Comment[];
    onAddComment: (text: string) => void;
};

const cn = block('company-comments');

export const CompanyComments: FC<CompanyCommentsProps> = ({
    comments = [],
    onAddComment,
}) => {
    const [commentText, setCommentText] = useState('');
    const { user } = useAuth();
    
    const handleSubmit = () => {
        if (commentText.trim()) {
            onAddComment(commentText);
            setCommentText('');
        }
    };

    return (
        <Card view="outlined" className={cn()}>
            <Text variant="subheader-2" className={cn('title')}>Комментарии</Text>
            
            <div className={cn('comments-list')}>
                {comments.length === 0 ? (
                    <Text variant="body-1" className={cn('no-comments')}>Нет комментариев</Text>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.id} view="filled" theme="info" className={cn('comment')}>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text variant="body-2" className={cn('author')}>
                                    {comment.author} {comment.isAdmin && <span className={cn('admin-badge')}>AMDG</span>}
                                </Text>
                                <Text variant="caption-1" className={cn('date')}>
                                    {new Date(comment.date).toLocaleString()}
                                </Text>
                            </Flex>
                            <Text variant="body-1" className={cn('text')}>
                                {comment.text}
                            </Text>
                        </Card>
                    ))
                )}
            </div>
            
            {user && (
                <div className={cn('add-comment')}>
                    <TextArea
                        size="m"
                        placeholder="Напишите комментарий..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className={cn('textarea')}
                        rows={3}
                    />
                    <Button
                        view="action"
                        size="m"
                        onClick={handleSubmit}
                        disabled={!commentText.trim()}
                        className={cn('submit-button')}
                    >
                        Отправить
                    </Button>
                </div>
            )}
        </Card>
    );
};