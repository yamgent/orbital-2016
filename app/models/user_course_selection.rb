class UserCourseSelection < ActiveRecord::Base
  belongs_to :user
  belongs_to :course
end
