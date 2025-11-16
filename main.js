
if (typeof window !== 'undefined' && typeof window.Typed !== 'undefined') {
  new Typed(".text", {
    strings: ["","'m Cyber Security student.","want to be a Cyber Security Analyst.","want to be a Network Administrator."],
    typeSpeed: 100,
    backSpeed: 50,
    loop: true,
  });
}




const scrollers = document.querySelectorAll('.scroller');
function addAnimation() {
    scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector('.scroller__inner');
        const scrollerInnerContent = Array.from(scrollerInner.children);

        // Clone items for infinite scroll effect
        scrollerInnerContent.forEach((item, idx) => {
            // Assign stable index to original item
            item.setAttribute('data-index', idx);

            // Clone item for infinite scroll and preserve index
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute('aria-hidden', true);
            duplicatedItem.setAttribute('data-index', idx);
            scrollerInner.appendChild(duplicatedItem);
        });

        // Set animation direction based on data-direction attribute
        const direction = scroller.getAttribute('data-direction');
        if (direction === 'reverse') {
            scroller.style.setProperty('--_animation-direction', 'reverse');
        }

        // Set animation speed based on data-speed attribute
        const speed = scroller.getAttribute('data-speed');
        if (speed === 'fast') {
            scroller.setAttribute('data-duration', 'fast');
        } else if (speed === 'slow') {
            scroller.style.setProperty('--_animation-duration', '60s');
        }
    });
}

addAnimation()

const menuBtn = document.querySelector(".menu");
const menuOverlay = document.querySelector(".menu-overlay");
const closeBtn = document.querySelector(".close-btn");
const links = document.querySelectorAll(".menu-link-overlay a");

const closeOverlay = () => {
  menuOverlay.classList.remove("opened");
  document.body.style.paddingRight = "0";
};

links.forEach((elm) => {
  elm.addEventListener("click", closeOverlay);
});

menuBtn.addEventListener("click", () => {
  menuOverlay.classList.toggle("opened");
});

closeBtn.addEventListener("click", closeOverlay);




(() => {
  const headerLinks = document.querySelectorAll(".menu-list a")
  headerLinks.forEach((elm) => {
    elm.addEventListener('click', (e) => {
        e.preventDefault()


        const targetId = elm.getAttribute("href")
        const targetElm = document.querySelector(targetId)
        const offset = 100

        const top = targetElm.getBoundingClientRect().top
        const elemOffsetPosition = top + window.pageYOffset - offset

        window.scrollTo({
          top: elemOffsetPosition,
          behavior: "smooth"
        })

        history.pushState({}, null, targetId)

        return false
    })
  })
})()

;(() => {
  const block = document.querySelector('.message-block');
  const toggle = document.querySelector('.message-toggle');
  const panel = document.querySelector('.message-panel');
  const form = document.getElementById('messageForm');
  const cancelBtn = document.querySelector('.message-cancel');
  const statusElm = document.querySelector('.message-status');

  if (!block || !toggle || !panel || !form) return;

  const openPanel = () => { panel.classList.add('open'); };
  const closePanel = () => { panel.classList.remove('open'); };

  toggle.addEventListener('click', () => {
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  });

  cancelBtn && cancelBtn.addEventListener('click', () => { closePanel(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name') || '',
      message: fd.get('message') || ''
    };
    statusElm.textContent = 'กำลังส่ง...';
    try {
      const tryPost = async (url) => {
        const r = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!r.ok) throw new Error('bad_status');
        return r.json();
      };
      let ok = false;
      const endpoints = [
        '/api/message',
        'http://localhost:8002/api/message',
        'http://localhost:8001/api/message'
      ];
      for (const url of endpoints) {
        try {
          const res = await tryPost(url);
          if (res && res.ok) { ok = true; break; }
        } catch (_) {}
      }
      if (ok) {
        statusElm.textContent = 'ส่งสำเร็จ';
        form.reset();
        setTimeout(() => { statusElm.textContent = ''; closePanel(); }, 1200);
      } else {
        statusElm.textContent = 'ส่งไม่สำเร็จ';
      }
    } catch {
      statusElm.textContent = 'เกิดข้อผิดพลาด';
    }
  });
})()



// Drag-to-scroll for project scrollers
;(() => {
  const scrollerInners = document.querySelectorAll('.projects-section .scroller .scroller__inner');

  scrollerInners.forEach((inner) => {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let wasDragged = false;

    const onMouseDown = (e) => {
      if (e.button !== 0) return; // only left click
      isDown = true;
      wasDragged = false;
      inner.classList.add('dragging');
      inner.style.animationPlayState = 'paused';
      startX = e.pageX;
      scrollStart = inner.scrollLeft;
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 10) { // Slightly higher threshold to avoid blocking clicks
        wasDragged = true;
      }
      e.preventDefault();
      inner.scrollLeft = scrollStart - dx;
    };

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      inner.classList.remove('dragging');
      inner.style.animationPlayState = 'running';
    };

    const onClick = (e) => {
      // Do not suppress clicks on anchors (image links)
      if (wasDragged && !e.target.closest('a')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Mouse events
    inner.addEventListener('mousedown', onMouseDown);
    inner.addEventListener('mousemove', onMouseMove);
    inner.addEventListener('mouseup', endDrag);
    inner.addEventListener('mouseleave', endDrag);
    inner.addEventListener('click', onClick, true); // Capture click to prevent if dragged

    // Touch support
    inner.addEventListener('touchstart', (e) => {
      isDown = true;
      wasDragged = false;
      inner.classList.add('dragging');
      inner.style.animationPlayState = 'paused';
      startX = e.touches[0].pageX;
      scrollStart = inner.scrollLeft;
    }, { passive: true });

    inner.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const dx = e.touches[0].pageX - startX;
      if (Math.abs(dx) > 10) { // Slightly higher threshold to avoid blocking taps
        wasDragged = true;
      }
      inner.scrollLeft = scrollStart - dx;
    }, { passive: true });

    inner.addEventListener('touchend', endDrag);
    inner.addEventListener('touchcancel', endDrag);
  });
})();

// Wrap project images with anchor to open in new tab (robust behavior)
;(() => {
  const imgs = document.querySelectorAll('.projects-section .img-list img');
  imgs.forEach((img) => {
    // Skip if already inside a link
    if (img.closest('a')) return;
    const a = document.createElement('a');
    a.href = img.src;
    // Open in a new tab
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    img.parentNode.insertBefore(a, img);
    a.appendChild(img);
  });
})();

// Image Modal Viewer (open in same tab with zoom/pan)
;(() => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Build image list from ORIGINAL items (exclude clones)
  const originalImages = document.querySelectorAll('.projects-section .img-list li:not([aria-hidden="true"]) img');
  const imageArray = Array.from(originalImages).map((img, idx) => ({
    src: img.src,
    alt: img.alt || `Project ${idx + 1}`
  }));

  let currentImageIndex = 0;

  // Zoom/Pan state
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;

  function applyTransform() {
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    modalImg.style.cursor = scale > 1 ? 'grab' : 'default';
  }

  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  }

  function updateModalImage() {
    const item = imageArray[currentImageIndex];
    if (!item) return;
    modalImg.src = item.src;
    modalImg.alt = item.alt;
    prevBtn.disabled = currentImageIndex === 0;
    nextBtn.disabled = currentImageIndex === imageArray.length - 1;
    resetTransform();
  }

  function openModalWithIndex(index) {
    currentImageIndex = Math.max(0, Math.min(index, imageArray.length - 1));
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    updateModalImage();
  }

  function openModalWithSrc(src) {
    const idx = imageArray.findIndex((it) => it.src === src);
    openModalWithIndex(idx >= 0 ? idx : 0);
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function showPrevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateModalImage();
    }
  }

  function showNextImage() {
    if (currentImageIndex < imageArray.length - 1) {
      currentImageIndex++;
      updateModalImage();
    }
  }

  const imageLinks = document.querySelectorAll('.projects-section .img-list a');
  imageLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const img = a.querySelector('img');
      if (img) openModalWithSrc(img.src);
    });
  });

  const allImages = document.querySelectorAll('.projects-section .img-list img');
  allImages.forEach((img) => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openModalWithSrc(img.src);
    });
  });

  const projectsSection = document.querySelector('.projects-section');
  if (projectsSection) {
    projectsSection.addEventListener('click', (e) => {
      const targetImg = e.target && e.target.closest('.img-list img');
      if (!targetImg) return;
      e.preventDefault();
      openModalWithSrc(targetImg.src);
    }, true);
  }

  // Close and navigation
  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'block') return;
    if (e.key === 'Escape') return closeModal();
    if (e.key === 'ArrowLeft') return showPrevImage();
    if (e.key === 'ArrowRight') return showNextImage();
  });

  // Zoom with wheel
  modalImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    const step = 0.15;
    scale = Math.min(4, Math.max(1, scale - delta * step));
    applyTransform();
  }, { passive: false });

  // Double-click to toggle zoom
  modalImg.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (scale === 1) {
      scale = 2;
    } else {
      scale = 1;
      translateX = 0;
      translateY = 0;
    }
    applyTransform();
  });

  // Pan when zoomed (mouse)
  modalImg.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
    isPanning = true;
    modalImg.style.cursor = 'grabbing';
    panStartX = e.clientX - translateX;
    panStartY = e.clientY - translateY;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    translateX = e.clientX - panStartX;
    translateY = e.clientY - panStartY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (!isPanning) return;
    isPanning = false;
    modalImg.style.cursor = 'grab';
  });

  // Touch: pinch to zoom and pan
  let pinchStartDist = 0;
  let pinchStartScale = 1;

  modalImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      pinchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStartScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      const t = e.touches[0];
      isPanning = true;
      panStartX = t.clientX - translateX;
      panStartY = t.clientY - translateY;
    }
  }, { passive: true });

  modalImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      scale = Math.min(4, Math.max(1, (dist / pinchStartDist) * pinchStartScale));
      applyTransform();
    } else if (e.touches.length === 1 && isPanning && scale > 1) {
      const t = e.touches[0];
      translateX = t.clientX - panStartX;
      translateY = t.clientY - panStartY;
      applyTransform();
    }
  }, { passive: true });

  modalImg.addEventListener('touchend', () => {
    isPanning = false;
  });
})();
