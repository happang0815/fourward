//리뷰 조회

const BASE_URL = 'http://teacherdev09.kro.kr:10002/endpoint';

async function loadReviews() {
    const productIdInput = document.getElementById('reviewId');
    const productId = productIdInput.value.trim();
    const reviewList = document.getElementById('reviewList');

    if (!productId) {
        alert('상품 ID를 입력해 주세요!');
        productIdInput.focus();
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/products/${productId}/reviews`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`조회 실패: 상태 코드 ${response.status}`);
        }

        const result = await response.json();
        console.log('서버가 보낸 실제 응답 데이터:', result); 
        
        const reviews = Array.isArray(result) 
            ? result 
            : (result.data || result.reviews || result.content || []);

        reviewList.innerHTML = '';

        if (reviews.length === 0) {
            reviewList.innerHTML = '<li>등록된 리뷰가 없습니다.</li>';
            return;
        }

        reviews.forEach(review => {
            const li = document.createElement('li');
            const reviewId = review.id || review.reviewId;

            li.innerHTML = `
                <p><strong>작성자:</strong> ${review.author || review.nickname || review.userName || '익명'}</p>
                <p><strong>평점:</strong> ${review.rating}점</p>
                <p><strong>내용:</strong> ${review.content}</p>
                <p><small><strong>작성일:</strong> ${review.createdAt || review.createDate || '오늘'}</small></p>
                <button onclick="deleteReview(${reviewId})">삭제</button>
                <hr>
            `;
            reviewList.appendChild(li);
        });

    } catch (error) {
        console.error('리뷰 조회 에러:', error);
        alert('리뷰를 불러오는 중 문제가 발생했습니다.');
    }
}