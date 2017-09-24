import Barba from 'barba.js';
import { TimelineMax } from 'gsap';

var lastClicked;

Barba.Dispatcher.on('linkClicked', function(el) {
  lastClicked = el;
});

var ExpandTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise.all([this.newContainerLoading, this.zoom()]).then(
      this.showNewPage.bind(this)
    );
  },

  zoom: function() {
    var deferred = Barba.Utils.deferred();

    let tl = new TimelineMax({
      onComplete: function() {
        deferred.resolve();
      }
    });
    let left = lastClicked.getBoundingClientRect().left;

    let cloned = lastClicked.cloneNode(true);

    let nextAll = $(lastClicked).nextAll();
    let prevAll = $(lastClicked).prevAll();

    cloned.classList.add('is-cloned');
    this.oldContainer.appendChild(cloned);
    tl.set(cloned, { x: left });

    let screenWidth = $(window).width();
    let bg = $(cloned).find('.item__bg');
    let title = $(cloned).find('.item__title');

    tl
      .to(cloned, 0.5, { x: 0, width: screenWidth }, 0)
      .to(title, 0.5, { y: 100, opacity: 0 }, 0, 0);
    if (prevAll.length) {
      let prevAllLeft = prevAll[0].getBoundingClientRect().left;
      tl.to(
        prevAll,
        0.5,
        {
          x: -(screenWidth / 3 + prevAllLeft)
        },
        0
      );
    }
    if (nextAll.length) {
      let nextAllLeft = screenWidth - nextAll[0].getBoundingClientRect().left;
      tl.to(
        nextAll,
        0.5,
        {
          x: nextAllLeft
        },
        0
      );

      // tl.staggerTo(nextAll,1,{
      //  cycle:{
      //    x: function(n) {
      //      if(n<1) {
      //        return nextAllLeft;
      //      }
      //    }
      //  }
      // },0,0);
    }

    tl.to(bg, 0.5, { x: 0 }, 0);
    return deferred.promise;
  },

  showNewPage: function() {
    var $el = $(this.newContainer);
    var thetitle = $(this.newContainer).find('.single__title');
    var timeline = new TimelineMax();
    $(this.oldContainer).hide();

    $el.css({
      visibility : 'visible',
    });

    timeline.to(thetitle,1,{y:0});

    this.done();
  }
});

var BackTransition = Barba.BaseTransition.extend({
  start: function() {
    Promise.all([this.newContainerLoading, this.zoom()]).then(
      this.showNewPage.bind(this)
    );
  },

  zoom: function() {
    var deferred = Barba.Utils.deferred();

    deferred.resolve();

    return deferred.promise;
  },

  showNewPage: function() {
    this.done();
  }
});

Barba.Pjax.getTransition = function() {
  var transitionObj = ExpandTransition;

  if (Barba.HistoryManager.prevStatus().namespace === 'Single') {
    transitionObj = BackTransition;
  }
  return transitionObj;
};

Barba.Pjax.start();
