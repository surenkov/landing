/**
 * Created by surenkov on 10/6/16.
 */
import { list, upload, remove, guardResponse } from '../utility/api'

export const MEDIA_FETCHED = 'MEDIA_FETCHED';
export const MEDIA_UPLOADED = 'MEDIA_UPLOADED';
export const MEDIA_DELETED = 'MEDIA_DELETED';


const mediaFetched = (data) => ({
    type: MEDIA_FETCHED,
    data
});

const mediaUploaded = (data) => ({
    type: MEDIA_UPLOADED,
    data
});

const mediaDeleted = (id) => ({
    type: MEDIA_DELETED,
    id
});


export const fetchMedia = () => (
    (dispatch) => guardResponse(
        list('/manager/api/media')
            .then((data) => dispatch(mediaFetched(data)))
    )
);

export const uploadMedia = (file) => (
    (dispatch) => {
        var formData = new FormData();
        formData.append('file', file);

        return guardResponse(
            upload('/manager/api/media', formData)
                .then((data) => dispatch(mediaUploaded(data))),
            'Не удалось отправить файл'
        )
    }
);

export const deleteMedia = (id) => (
    (dispatch) => guardResponse(
        remove(`/manager/api/media/${encodeURIComponent(id)}`)
            .then(() => dispatch(mediaDeleted(id)))
    )
);
