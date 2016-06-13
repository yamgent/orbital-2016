class User < ActiveRecord::Base
  has_secure_password

  has_many :user_course_selections
  has_many :courses, through: :user_course_selections

  has_many :user_tutorial_selections
  has_many :tutorials, through: :user_tutorial_selections
end
