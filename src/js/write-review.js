
// 리뷰 등록

const BASE_URL = 'http://teacherdev09.kro.kr:10002/endpoint';

async function createReview() {
    const productId = document.getElementById('reviewId').value.trim();
    const author = document.getElementById('authorInput').value.trim();
    const rating = parseInt(document.getElementById('ratingInput').value);
    const content = document.getElementById('contentInput').value.trim();

    if (!productId) {
        alert('상품 ID를 먼저 입력하세요!');
        document.getElementById('reviewId').focus();
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        return;
    }

    if (!author || !content) {
        alert('작성자와 리뷰 내용을 입력해주세요.');
        return;
    }

    const requestData = {
        author: author,
        rating: rating,
        content: content
    };

    try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('리뷰 등록 실패');
        }

        alert('리뷰가 성공적으로 등록되었습니다.');

        location.href = 'review.html';
        
    } catch (error) {
        console.error('리뷰 등록 에러:', error);
        alert('리뷰 등록에 실패했습니다.');
    }
}



//리뷰 삭제

async function deleteReview() {

    const inputElement = document.getElementById('deleteReviewIdInput');
    
    if (!inputElement) {
        alert('HTML에서 id="deleteReviewIdInput" 태그를 찾을 수 없습니다.');
        return;
    }

    const reviewId = inputElement.value.trim();

    if (!reviewId) {
        alert('삭제할 리뷰 ID를 입력해주세요!');
        inputElement.focus();
        return;
    }

    if (!confirm(`정말 ${reviewId}번 리뷰를 삭제하시겠습니까?`)) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
            alert(data.message || '리뷰 삭제에 실패했습니다.');
            return;
        }

        alert(data.message || '리뷰가 삭제되었습니다.');
        inputElement.value = '';

    } catch (error) {
        console.error('리뷰 삭제 에러:', error);
        alert('네트워크 오류가 발생했습니다.');
    }
}