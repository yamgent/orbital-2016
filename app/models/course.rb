class Course < ActiveRecord::Base
  has_many :lectures, dependent: :restrict_with_error
  has_many :tutorials, dependent: :restrict_with_error

  has_many :user_course_selections, dependent: :restrict_with_error
  has_many :users, through: :user_course_selections
end
