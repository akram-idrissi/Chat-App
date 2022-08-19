var groups = document.getElementById("groups");
var groupSection = document.getElementById("group-section");
var groupDownArr = document.getElementById("group-down-arr");

var members = document.getElementById("members");
var memberSection = document.getElementById("member-section");
var memberDownArr = document.getElementById("member-down-arr");

var addMembers = document.getElementById("add-member-section");
var addMemberSection = document.getElementById("members-grp");
var addMemberDownArr = document.getElementById("add-member-down-arr");

groupSection.addEventListener("click", function () {
    hideAndToggle(groups, groupDownArr, "hidden", "fa-rotate-180");
});

memberSection.addEventListener("click", function () {
    hideAndToggle(members, memberDownArr, "hidden", "fa-rotate-180");
});

try {
    addMembers.addEventListener("click", function () {
        hideAndToggle(
            addMemberSection,
            addMemberDownArr,
            "hidden",
            "fa-rotate-180"
        );
    });
} catch (error) {}

function hideAndToggle(section, arrow, class1, class2) {
    section.classList.toggle(class1);
    if (arrow != null) arrow.classList.toggle(class2);
}
