import axios from "axios";

const BASE_URL = 'http://192.168.1.15:8000/';

export const endpoint = {
    'roles': '/roles/',
    'majors': '/majors/',
    'students': '/students/',
    'students_id': (id) => `/students/${id}/`,
    'lecturers': '/lecturers/',
    'school_years': '/school_years/',
    'departments': '/departments/',
    'register': '/users/',
    'login': '/o/token/',
    'current-user': '/users/current-user/', 
    'change-password': '/users/change-password/',
    'theses': '/theses/',
    'theses01': '/theses01/',
    'theses01_id': (id) => `/theses01/${id}/`,
    'lecturer-councils': '/lecturer-councils/',
    'theses_of_council': (councilId) => `/councils/${councilId}/theses/`,
    'thesis-details': (thesisId) => `/theses/${thesisId}/`,
    'thesis_scores': '/thesis_scores/',
    'score_columns': '/score_columns/',
    'score_details': '/score_details/',
    'score_detail': (id) => `/score_details/${id}/`,
    'score_details_thesisScoreId': (thesisScoreId) => `/score_details/?thesisScoreId=${thesisScoreId}`,
    'students-without-thesis': '/students-without-thesis/',
    'councils': '/councils/',
    'councils01': '/councils01/',
    'councils-contain-than-5-thesis': '/councils-contain-than-5-thesis/',
    'council_detail_phanBien': (position, council) => `/council_details/?position=${position}&council=${council}`,
    'lecturers_id': (id) => `/lecturers/${id}/`,
    'supervisors': '/supervisors/',
    'council_details': '/council_details/',
    'create_council_detail': '/create_council_detail/',
    'department_admins': '/department_admins/',
    'average-score-by-school-year': '/theses/average-score-by-school-year/',
    'major_frequency': '/major_frequency/',
}

export const authAPI = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL,
})