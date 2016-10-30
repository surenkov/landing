// @flow
import { list, upload, remove, guardResponse } from '../utility/api'
import type { Dispatch, Action } from '../flow/redux'
import type { Media } from '../flow/types'

export const MEDIA_FETCHED = 'MEDIA_FETCHED';
export const MEDIA_UPLOADED = 'MEDIA_UPLOADED';
export const MEDIA_DELETED = 'MEDIA_DELETED';


const mediaFetched = (data): Action => ({
    type: MEDIA_FETCHED,
    data
});

const mediaUploaded = (data: Media): Action => ({
    type: MEDIA_UPLOADED,
    data
});

const mediaDeleted = (id: string): Action => ({
    type: MEDIA_DELETED,
    id
});


export const fetchMedia = (): Action => (
    (dispatch: Dispatch) => guardResponse(
        list('/manager/api/media')
            .then((data) => dispatch(mediaFetched(data)))
    )
);

export const uploadMedia = (file: HTMLInputElement): Action => (
    (dispatch: Dispatch) => {
        let formData = new FormData();
        formData.append('file', file);

        return guardResponse(
            upload('/manager/api/media', formData)
                .then((data) => dispatch(mediaUploaded(data))),
            'Не удалось отправить файл'
        )
    }
);

export const deleteMedia = (id: string): Action => (
    (dispatch: Dispatch) => guardResponse(
        remove(`/manager/api/media/${encodeURIComponent(id)}`)
            .then(() => dispatch(mediaDeleted(id)))
    )
);
